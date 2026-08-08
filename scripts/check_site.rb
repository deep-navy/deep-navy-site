#!/usr/bin/env ruby
# frozen_string_literal: true

require "base64"
require "digest"
require "pathname"
require "set"
require "uri"

site = Pathname(ARGV.fetch(0, "_site")).expand_path
baseurl = ARGV.fetch(1, "").sub(%r{\A/}, "").sub(%r{/\z}, "")
abort "site directory not found: #{site}" unless site.directory?

html_files = site.glob("**/*.html")
errors = []
ids_by_file = {}

html_files.each do |file|
  html = file.read
  relative = file.relative_path_from(site)
  errors << "#{relative}: missing title" unless html.match?(%r{<title>[^<]+</title>}i)
  errors << "#{relative}: missing meta description" unless html.match?(%r{<meta\s+name=["']description["']\s+content=["'][^"']+["']}i)
  errors << "#{relative}: missing canonical URL" unless html.match?(%r{<link\s+rel=["']canonical["']}i)
  errors << "#{relative}: expected one main element" unless html.scan(%r{<main\b}i).length == 1
  errors << "#{relative}: expected one h1" unless html.scan(%r{<h1\b}i).length == 1
  ids = html.scan(/\sid=["']([^"']+)["']/i).flatten
  duplicate_ids = ids.group_by(&:itself).select { |_id, occurrences| occurrences.length > 1 }.keys
  errors << "#{relative}: duplicate ids #{duplicate_ids.join(', ')}" unless duplicate_ids.empty?
  ids_by_file[file] = ids.to_set

  # A render-blocking <script src> in <head> is a single point of failure for
  # the whole page: if that one request stalls - flaky network, VPN, proxy, an
  # extension holding it - the parser blocks before <body> exists and the
  # browser paints an empty canvas. Reloading does not recover, because it
  # stalls again. Scripts that genuinely must run pre-paint belong inline,
  # where there is no request to stall.
  head = html.split(%r{</head>}i, 2).first.to_s
  head.scan(%r{<script\b([^>]*\ssrc=[^>]*)>}i).flatten.each do |attributes|
    next if attributes.match?(/\s(defer|async)\b/i)

    errors << "#{relative}: render-blocking <script src> in <head> can blank the page; inline it or add defer"
  end

  # An inline script the CSP refuses is silently dropped, so a stale hash costs
  # a theme flash that no test would otherwise catch. Verify each inline block
  # against the policy the page ships with.
  csp = html[%r{<meta http-equiv="Content-Security-Policy" content="([^"]+)"}i, 1]
  next unless csp

  allowed = csp.scan(/'sha256-([A-Za-z0-9+\/=]+)'/).flatten.to_set
  html.scan(%r{<script\b([^>]*)>(.*?)</script>}im).each do |attributes, body|
    next if attributes.match?(/\ssrc=/i) || attributes.match?(%r{application/ld\+json}i)

    digest = Base64.strict_encode64(Digest::SHA256.digest(body))
    next if allowed.include?(digest)

    errors << "#{relative}: inline script is not permitted by the page CSP (expected 'sha256-#{digest}')"
  end
end

def target_file(site, source, href, baseurl)
  path = href.split(/[?#]/, 2).first
  return source if path.nil? || path.empty?
  candidate = if path.start_with?("/")
                root_path = path.delete_prefix("/")
                if !baseurl.empty? && (root_path == baseurl || root_path.start_with?("#{baseurl}/"))
                  root_path = root_path.delete_prefix(baseurl).delete_prefix("/")
                end
                site.join(root_path)
              else
                source.dirname.join(path).cleanpath
              end
  return candidate if candidate.file?
  return candidate.join("index.html") if candidate.directory?
  return Pathname("#{candidate}.html") if Pathname("#{candidate}.html").file?
  candidate
end

html_files.each do |file|
  html = file.read
  relative = file.relative_path_from(site)
  html.scan(/\shref=["']([^"']*)["']/i).flatten.each do |href|
    next if href.match?(%r{\A(?:https?:|mailto:|tel:|data:|javascript:)})
    if href.empty?
      errors << "#{relative}: empty href"
      next
    end
    target = target_file(site, file, href, baseurl)
    unless target.file?
      errors << "#{relative}: broken internal link #{href}"
      next
    end
    fragment = href.include?("#") ? href.split("#", 2).last.split("?", 2).first : ""
    next if fragment.nil? || fragment.empty? || !target.extname.match?(/\.html?/)
    target_ids = ids_by_file[target] || target.read.scan(/\sid=["']([^"']+)["']/i).flatten.to_set
    errors << "#{relative}: missing fragment ##{fragment} in #{href}" unless target_ids.include?(URI.decode_www_form_component(fragment))
  end
end

app_pages = [site.join("app/index.html"), site.join("app/github/callback/index.html")]
app_pages.each do |file|
  unless file.file?
    errors << "missing authenticated app page #{file.relative_path_from(site)}"
    next
  end
  html = file.read
  relative = file.relative_path_from(site)
  errors << "#{relative}: app pages require no-referrer" unless html.match?(%r{<meta\s+name=["']referrer["']\s+content=["']no-referrer["']}i)
  errors << "#{relative}: app pages require a self-only form-action CSP" unless html.match?(%r{form-action 'self';}i)
  # Inline scripts used to be banned outright to keep the policy strict. They
  # are now permitted only when hash-pinned - verified for every page above -
  # because the two blocks that must run pre-paint were the last render-
  # blocking requests in <head>, and a stalled request there paints an empty
  # page that no reload recovers from. The property worth protecting is that
  # the policy never widens to arbitrary inline script.
  errors << "#{relative}: app pages must never allow 'unsafe-inline' script" if html.match?(%r{script-src[^;]*'unsafe-inline'}i)
  # The scrubber captures location.search before any app code reads it. It is
  # inline now, so identify it by what it defines rather than by a filename.
  scrubber = html.index("deepNavyInitialQuery")
  generated_client = html.index("platform-api-client.js")
  app_state = html.index("app-state.js")
  agent_roles = html.index("agent-roles.js")
  application = html.index("assets/js/app.js")
  unless scrubber && generated_client && app_state && agent_roles && application && scrubber < generated_client && generated_client < app_state && app_state < agent_roles && agent_roles < application
    errors << "#{relative}: secure callback scrubber and generated API client script order is invalid"
  end
  errors << "#{relative}: hidden elements must have an author-level display guard" unless site.join("assets/css/main.css").read.include?("[hidden] { display: none !important; }")
end

github_callback = site.join("app/github/callback/index.html")
if github_callback.file? && !github_callback.read.match?(%r{data-github-callback=["']true["']}i)
  errors << "app/github/callback/index.html: missing dedicated GitHub callback marker"
end

errors << "missing generated browser API bundle" unless site.join("assets/js/platform-api-client.js").file?

if errors.empty?
  puts "Checked #{html_files.length} HTML files: metadata, headings, IDs, and internal links are valid."
else
  warn errors.join("\n")
  abort "site checks failed with #{errors.length} error(s)"
end

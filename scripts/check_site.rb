#!/usr/bin/env ruby
# frozen_string_literal: true

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

app_pages = [site.join("app/index.html"), site.join("app/callback/index.html"), site.join("app/github/callback/index.html")]
app_pages.each do |file|
  unless file.file?
    errors << "missing authenticated app page #{file.relative_path_from(site)}"
    next
  end
  html = file.read
  relative = file.relative_path_from(site)
  errors << "#{relative}: app pages require no-referrer" unless html.match?(%r{<meta\s+name=["']referrer["']\s+content=["']no-referrer["']}i)
  errors << "#{relative}: app pages require a self-only form-action CSP" unless html.match?(%r{form-action 'self';}i)
  errors << "#{relative}: app pages must not contain inline scripts" if html.scan(%r{<script(?![^>]*\ssrc=)[^>]*>}i).any?
  scrubber = html.index("callback-scrubber.js")
  generated_client = html.index("platform-api-client.js")
  application = html.index("assets/js/app.js")
  unless scrubber && generated_client && application && scrubber < generated_client && generated_client < application
    errors << "#{relative}: secure callback scrubber and generated API client script order is invalid"
  end
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

#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "rbconfig"
require "tmpdir"

script = File.expand_path("write_runtime_config.rb", __dir__)
base_environment = {
  "DEEP_NAVY_ENVIRONMENT" => "development",
  "SITE_URL" => "https://deep-navy.github.io/deep-navy-site",
  "SITE_API_BASE_URL" => "https://api.dev.deep.navy",
  "SITE_COGNITO_DOMAIN" => "https://deep-navy-dev.auth.us-west-2.amazoncognito.com",
  "SITE_COGNITO_CLIENT_ID" => "publicclientid123",
  "SITE_COGNITO_CALLBACK_URL" => "https://deep-navy.github.io/deep-navy-site/app/callback/",
  "SITE_COGNITO_LOGOUT_URL" => "https://deep-navy.github.io/deep-navy-site/app/",
  "SITE_PLAN_ID" => "founding-team",
  "GITHUB_SHA" => "fa01d7cc4c68c1e7ee606a44677ad70d16f4c563"
}.freeze

def run_writer(script, environment)
  Dir.mktmpdir("deep-navy-runtime-config") do |directory|
    stdout, stderr, status = Open3.capture3(environment, RbConfig.ruby, script, chdir: directory, unsetenv_others: true)
    output = File.join(directory, "_config.runtime.yml")
    return [stdout, stderr, status, File.file?(output) ? JSON.parse(File.read(output)) : nil]
  end
end

_stdout, stderr, status, configuration = run_writer(script, base_environment)
abort "valid runtime configuration failed: #{stderr}" unless status.success?
runtime = configuration.fetch("runtime")
abort "API origin changed" unless runtime.fetch("api_base_url") == "https://api.dev.deep.navy"
abort "callback URL changed" unless runtime.fetch("cognito_callback_url").end_with?("/app/callback/")
abort "unexpected handwritten API paths" if runtime.key?("api_paths")
abort "unexpected site URL" unless configuration.fetch("url") == "https://deep-navy.github.io"
abort "unexpected site base path" unless configuration.fetch("baseurl") == "/deep-navy-site"

invalid_cases = {
  "CSP-like API origin injection" => { "SITE_API_BASE_URL" => "https://api.dev.deep.navy; script-src *" },
  "site URL credentials" => { "SITE_URL" => "https://user@deep-navy.github.io/deep-navy-site" },
  "site URL query" => { "SITE_URL" => "https://deep-navy.github.io/deep-navy-site?preview=true" },
  "non-normalized site base path" => { "SITE_URL" => "https://deep-navy.github.io/deep-navy-site/" },
  "site base path traversal" => { "SITE_URL" => "https://deep-navy.github.io/preview/../deep-navy-site" },
  "cross-origin Cognito callback" => { "SITE_COGNITO_CALLBACK_URL" => "https://example.invalid/app/callback/" },
  "provider billing identifier" => { "SITE_PLAN_ID" => "price_123$" },
  "unknown environment" => { "DEEP_NAVY_ENVIRONMENT" => "staging" }
}

invalid_cases.each do |name, override|
  _invalid_stdout, _invalid_stderr, invalid_status, invalid_configuration = run_writer(script, base_environment.merge(override))
  abort "#{name} was accepted" if invalid_status.success? || invalid_configuration
end

puts "Runtime configuration accepts only safe, public, same-origin deployment values."

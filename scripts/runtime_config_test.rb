#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "rbconfig"
require "tmpdir"

script = File.expand_path("write_runtime_config.rb", __dir__)
base_environment = {
  "DEEP_NAVY_ENVIRONMENT" => "development",
  "SITE_URL" => "https://dev.deep.navy",
  "SITE_API_BASE_URL" => "https://dev.api.deep.navy",
  "SITE_COGNITO_DOMAIN" => "https://deep-navy-dev.auth.us-west-2.amazoncognito.com",
  "SITE_COGNITO_CLIENT_ID" => "publicclientid123",
  "SITE_COGNITO_CALLBACK_URL" => "https://dev.deep.navy/app/callback/",
  "SITE_COGNITO_LOGOUT_URL" => "https://dev.deep.navy/app/",
  "SITE_PLAN_ID" => "founding-team",
  "SITE_STRIPE_PUBLISHABLE_KEY" => "pk_test_51DeepNavyPublic123456789",
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
abort "API origin changed" unless runtime.fetch("api_base_url") == "https://dev.api.deep.navy"
abort "callback URL changed" unless runtime.fetch("cognito_callback_url").end_with?("/app/callback/")
abort "Stripe publishable key changed" unless runtime.fetch("stripe_publishable_key").start_with?("pk_test_")
abort "unexpected handwritten API paths" if runtime.key?("api_paths")
abort "unexpected site URL" unless configuration.fetch("url") == "https://dev.deep.navy"
abort "unexpected site base path" unless configuration.fetch("baseurl") == ""

invalid_cases = {
  "CSP-like API origin injection" => { "SITE_API_BASE_URL" => "https://dev.api.deep.navy; script-src *" },
  "site URL credentials" => { "SITE_URL" => "https://user@dev.deep.navy" },
  "site URL query" => { "SITE_URL" => "https://dev.deep.navy?preview=true" },
  "non-normalized site base path" => { "SITE_URL" => "https://dev.deep.navy//preview" },
  "site base path traversal" => { "SITE_URL" => "https://dev.deep.navy/preview/../app" },
  "cross-origin Cognito callback" => { "SITE_COGNITO_CALLBACK_URL" => "https://example.invalid/app/callback/" },
  "provider billing identifier" => { "SITE_PLAN_ID" => "price_123$" },
  "secret Stripe key" => { "SITE_STRIPE_PUBLISHABLE_KEY" => "sk_test_secret123456789" },
  "live Stripe key in development" => { "SITE_STRIPE_PUBLISHABLE_KEY" => "pk_live_51DeepNavyPublic123456789" },
  "missing Stripe key in development" => { "SITE_STRIPE_PUBLISHABLE_KEY" => "" },
  "unknown environment" => { "DEEP_NAVY_ENVIRONMENT" => "staging" }
}

invalid_cases.each do |name, override|
  _invalid_stdout, _invalid_stderr, invalid_status, invalid_configuration = run_writer(script, base_environment.merge(override))
  abort "#{name} was accepted" if invalid_status.success? || invalid_configuration
end

puts "Runtime configuration accepts only safe, public, same-origin deployment values."

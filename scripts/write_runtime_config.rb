#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "uri"

def public_value(name)
  ENV.fetch(name, "").strip
end

def public_origin(name)
  value = public_value(name)
  return "" if value.empty?

  uri = URI.parse(value)
  local_http = uri.scheme == "http" && ["localhost", "127.0.0.1", "::1"].include?(uri.host)
  valid = (uri.scheme == "https" || local_http) && uri.host && !uri.user && !uri.password &&
    !uri.query && !uri.fragment && ["", "/"].include?(uri.path)
  abort "#{name} must be an HTTPS origin without credentials, path, query, or fragment" unless valid
  value.delete_suffix("/")
rescue URI::InvalidURIError
  abort "#{name} must be a valid HTTPS origin"
end

def public_site_url(name)
  value = public_value(name)
  return ["", ""] if value.empty?

  uri = URI.parse(value)
  local_http = uri.scheme == "http" && ["localhost", "127.0.0.1", "::1"].include?(uri.host)
  path = uri.path.to_s
  segments = path.delete_prefix("/").split("/", -1)
  normalized_path = path == "/" ? "" : path
  valid_path = normalized_path.empty? || (
    normalized_path.start_with?("/") &&
    !normalized_path.end_with?("/") &&
    !segments.any? { |segment| segment.empty? || [".", ".."].include?(segment) } &&
    !normalized_path.match?(/%2f|%5c|\\/i)
  )
  valid = (uri.scheme == "https" || local_http) && uri.host && !uri.user && !uri.password &&
    !uri.query && !uri.fragment && valid_path
  abort "#{name} must be an HTTPS site URL with a normalized path and without credentials, query, or fragment" unless valid

  origin = uri.dup
  origin.path = ""
  [origin.to_s, normalized_path]
rescue URI::InvalidURIError
  abort "#{name} must be a valid HTTPS site URL"
end

environment = public_value("DEEP_NAVY_ENVIRONMENT")
environment = "local" if environment.empty?
abort "DEEP_NAVY_ENVIRONMENT must be local, development, or production" unless %w[local development production].include?(environment)

plan_id = public_value("SITE_PLAN_ID")
plan_id = "founding-team" if plan_id.empty?
abort "SITE_PLAN_ID must be a stable lowercase public identifier" unless plan_id.match?(/\A[a-z0-9][a-z0-9_-]{0,63}\z/)

stripe_publishable_key = public_value("SITE_STRIPE_PUBLISHABLE_KEY")
unless stripe_publishable_key.empty? || stripe_publishable_key.match?(/\Apk_(?:test|live)_[A-Za-z0-9]{8,}\z/)
  abort "SITE_STRIPE_PUBLISHABLE_KEY must be a Stripe publishable key"
end
if environment == "development" && !stripe_publishable_key.start_with?("pk_test_")
  abort "development requires a Stripe test-mode publishable key"
end
if environment == "production" && !stripe_publishable_key.start_with?("pk_live_")
  abort "production requires a Stripe live-mode publishable key"
end

site_origin, site_base_path = public_site_url("SITE_URL")

# Customer sign-in is GitHub-backed and owned by the platform API, so the browser
# runtime no longer needs (or emits) any Cognito domain/client/callback/logout
# values. Only the platform API origin and the public Stripe key are required.
runtime = {
  "environment" => environment,
  "api_base_url" => public_origin("SITE_API_BASE_URL"),
  "plan_id" => plan_id,
  "stripe_publishable_key" => stripe_publishable_key,
  "build_revision" => public_value("GITHUB_SHA").then { |value| value.empty? ? "local" : value[0, 12] }
}

configuration = { "runtime" => runtime }
unless site_origin.empty?
  # GitHub Pages reports a project site as one URL. Jekyll keeps the origin and
  # project path separate so absolute_url does not duplicate the base path.
  configuration["url"] = site_origin
  configuration["baseurl"] = site_base_path
end

# JSON is valid YAML. Encoding values as JSON prevents a public Actions variable
# from changing the configuration structure. No secret input names are accepted.
File.write("_config.runtime.yml", JSON.pretty_generate(configuration) + "\n", mode: "w", encoding: "UTF-8")

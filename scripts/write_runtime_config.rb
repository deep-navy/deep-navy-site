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

def public_absolute_url(name)
  value = public_value(name)
  return "" if value.empty?

  uri = URI.parse(value)
  local_http = uri.scheme == "http" && ["localhost", "127.0.0.1", "::1"].include?(uri.host)
  valid = (uri.scheme == "https" || local_http) && uri.host && !uri.user && !uri.password && !uri.query && !uri.fragment
  abort "#{name} must be an HTTPS URL without credentials, query, or fragment" unless valid
  value
rescue URI::InvalidURIError
  abort "#{name} must be a valid HTTPS URL"
end

def same_origin?(left, right)
  left_uri = URI.parse(left)
  right_uri = URI.parse(right)
  left_uri.scheme == right_uri.scheme && left_uri.host == right_uri.host && left_uri.port == right_uri.port
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

cognito_client_id = public_value("SITE_COGNITO_CLIENT_ID")
unless cognito_client_id.empty? || cognito_client_id.match?(/\A[a-zA-Z0-9]{1,128}\z/)
  abort "SITE_COGNITO_CLIENT_ID must be a public Cognito app-client identifier"
end

site_origin, site_base_path = public_site_url("SITE_URL")
callback_url = public_absolute_url("SITE_COGNITO_CALLBACK_URL")
logout_url = public_absolute_url("SITE_COGNITO_LOGOUT_URL")
if !site_origin.empty? && ((!callback_url.empty? && !same_origin?(site_origin, callback_url)) || (!logout_url.empty? && !same_origin?(site_origin, logout_url)))
  abort "Cognito callback and logout URLs must use the deployed SITE_URL origin"
end

runtime = {
  "environment" => environment,
  "api_base_url" => public_origin("SITE_API_BASE_URL"),
  "cognito_domain" => public_origin("SITE_COGNITO_DOMAIN"),
  "cognito_client_id" => cognito_client_id,
  "cognito_callback_url" => callback_url,
  "cognito_logout_url" => logout_url,
  "oauth_scopes" => %w[openid email profile],
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

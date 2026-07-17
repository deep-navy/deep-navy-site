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

cognito_client_id = public_value("SITE_COGNITO_CLIENT_ID")
unless cognito_client_id.empty? || cognito_client_id.match?(/\A[a-zA-Z0-9]{1,128}\z/)
  abort "SITE_COGNITO_CLIENT_ID must be a public Cognito app-client identifier"
end

site_url = public_origin("SITE_URL")
callback_url = public_absolute_url("SITE_COGNITO_CALLBACK_URL")
logout_url = public_absolute_url("SITE_COGNITO_LOGOUT_URL")
if !site_url.empty? && ((!callback_url.empty? && !same_origin?(site_url, callback_url)) || (!logout_url.empty? && !same_origin?(site_url, logout_url)))
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
  "build_revision" => public_value("GITHUB_SHA").then { |value| value.empty? ? "local" : value[0, 12] },
  "allowed_redirect_hosts" => %w[github.com checkout.stripe.com billing.stripe.com]
}

configuration = { "runtime" => runtime }
configuration["url"] = site_url unless site_url.empty?

# JSON is valid YAML. Encoding values as JSON prevents a public Actions variable
# from changing the configuration structure. No secret input names are accepted.
File.write("_config.runtime.yml", JSON.pretty_generate(configuration) + "\n", mode: "w", encoding: "UTF-8")

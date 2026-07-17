#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"

def public_value(name)
  ENV.fetch(name, "").strip
end

environment = public_value("DEEP_NAVY_ENVIRONMENT")
environment = "local" if environment.empty?

runtime = {
  "environment" => environment,
  "api_base_url" => public_value("SITE_API_BASE_URL"),
  "cognito_domain" => public_value("SITE_COGNITO_DOMAIN"),
  "cognito_client_id" => public_value("SITE_COGNITO_CLIENT_ID"),
  "cognito_callback_url" => public_value("SITE_COGNITO_CALLBACK_URL"),
  "cognito_logout_url" => public_value("SITE_COGNITO_LOGOUT_URL"),
  "oauth_scopes" => %w[openid email profile],
  "plan_id" => public_value("SITE_PLAN_ID").then { |value| value.empty? ? "founding-team" : value },
  "build_revision" => public_value("GITHUB_SHA").then { |value| value.empty? ? "local" : value[0, 12] },
  "api_paths" => {
    "current_user" => "/deepnavy.v1.AuthService/GetCurrentUser",
    "bootstrap_organization" => "/deepnavy.v1.OrganizationService/BootstrapOrganization",
    "select_organization" => "/deepnavy.v1.OrganizationService/SelectOrganization",
    "github_installation" => "/deepnavy.v1.GitHubService/GetGitHubInstallation",
    "github_install_link" => "/deepnavy.v1.GitHubService/CreateGitHubInstallationLink",
    "subscription" => "/deepnavy.v1.BillingService/GetSubscription",
    "checkout" => "/deepnavy.v1.BillingService/CreateCheckoutSession",
    "billing_portal" => "/deepnavy.v1.BillingService/CreateBillingPortalSession",
    "teams" => "/deepnavy.v1.TeamService/ListTeams",
    "create_team" => "/deepnavy.v1.TeamService/CreateTeam"
  },
  "allowed_redirect_hosts" => %w[github.com checkout.stripe.com billing.stripe.com]
}

configuration = { "runtime" => runtime }
site_url = public_value("SITE_URL")
configuration["url"] = site_url unless site_url.empty?

# JSON is valid YAML. Encoding values as JSON prevents a public Actions variable
# from changing the configuration structure. No secret input names are accepted.
File.write("_config.runtime.yml", JSON.pretty_generate(configuration) + "\n", mode: "w", encoding: "UTF-8")

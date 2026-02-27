#!/usr/bin/env node
// Refreshes the Google Drive OAuth token before starting the MCP server.
// The official server creates OAuth2() without client_id/secret, so it
// can't auto-refresh expired tokens.

import fs from 'fs';
import https from 'https';

const credsPath = process.env.GDRIVE_CREDENTIALS_PATH || '/home/node/.gdrive-mcp/credentials.json';
const keysPath = process.env.GDRIVE_OAUTH_PATH || '/home/node/.gdrive-mcp/gcp-oauth.keys.json';

if (!fs.existsSync(credsPath) || !fs.existsSync(keysPath)) {
  process.exit(0); // Nothing to refresh
}

const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
const { client_id, client_secret } = keys.installed || keys.web || {};

if (!client_id || !creds.refresh_token) {
  process.exit(0);
}

// Skip if token is still valid (more than 5 min left)
if (creds.expiry_date && creds.expiry_date - Date.now() > 5 * 60 * 1000) {
  process.exit(0);
}

const params = new URLSearchParams({
  client_id,
  client_secret,
  refresh_token: creds.refresh_token,
  grant_type: 'refresh_token',
});

const req = https.request('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const token = JSON.parse(data);
    if (token.error) {
      console.error('gdrive token refresh failed:', token.error);
      process.exit(0); // Don't block server start
    }
    const newCreds = {
      access_token: token.access_token,
      refresh_token: creds.refresh_token,
      scope: token.scope || creds.scope,
      token_type: token.token_type,
      expiry_date: Date.now() + (token.expires_in * 1000),
    };
    fs.writeFileSync(credsPath, JSON.stringify(newCreds));
    process.exit(0);
  });
});
req.on('error', () => process.exit(0));
req.write(params.toString());
req.end();

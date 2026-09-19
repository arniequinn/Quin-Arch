/**
 * Client-Side Google Identity Services (GSI) OAuth Token Acquisition
 * Obtains an access token for Gmail API readonly and send scopes.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

// Default Web Client ID provisioned in Google Cloud
const GOOGLE_CLIENT_ID = "1076473543572-132d721q3l3q6d3e8euvt513g28d73b2.apps.googleusercontent.com";
const GMAIL_SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

const TOKEN_STORAGE_KEY = "archscope_gmail_access_token";
const TOKEN_EXPIRY_KEY = "archscope_gmail_token_expiry";

export function getStoredGmailAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

export function storeGmailAccessToken(token: string, expiresInSeconds: number = 3500) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
}

export function clearGmailAccessToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function requestGmailAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if GSI is loaded
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services script is still loading. Please try again in a few seconds."));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GMAIL_SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`OAuth Error: ${tokenResponse.error}`));
            return;
          }
          if (!tokenResponse.access_token) {
            reject(new Error("No access token was granted."));
            return;
          }
          storeGmailAccessToken(tokenResponse.access_token);
          resolve(tokenResponse.access_token);
        },
        error_callback: (err) => {
          reject(new Error(err?.message || "User closed the authentication window or permission denied."));
        },
      });

      // Request token with standard prompt
      client.requestAccessToken({ prompt: "consent" });
    } catch (e: any) {
      reject(e);
    }
  });
}

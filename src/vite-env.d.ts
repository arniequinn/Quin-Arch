/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Free Web3Forms access key (no account/password — https://web3forms.com/). Optional: the
   * lead-magnet email capture falls back to a mailto link when this isn't set. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SENDGRID_API_KEY: string;
  readonly TICKET_TAILOR_API_KEY: string;
  readonly TICKET_TAILOR_BASE_URL: string;
  readonly PUBLIC_GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

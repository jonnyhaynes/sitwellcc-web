/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SENDGRID_API_KEY: string;
  readonly TICKET_TAILOR_API_KEY: string;
  readonly TICKET_TAILOR_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_ENV?: string;
  readonly PUBLIC_NOINDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

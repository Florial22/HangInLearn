// Solid fallback so TS always knows about import.meta.env
declare interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}
declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

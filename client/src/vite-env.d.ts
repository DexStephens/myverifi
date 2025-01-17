/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CONTRACT_ADDRESS: `0x${string}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

// Fallback declarations in case the editor/TS server doesn't pick up vite/client types
// These ensure importing image assets works inside <script setup lang="ts"> blocks in .vue files.
declare module '*.gif' { const src: string; export default src }
declare module '*.jpg' { const src: string; export default src }
declare module '*.jpeg' { const src: string; export default src }
declare module '*.png' { const src: string; export default src }
declare module '*.webp' { const src: string; export default src }
declare module '*.avif' { const src: string; export default src }

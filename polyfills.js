import { Buffer } from 'buffer';

// Make buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = { env: {} };
  window.global = window;
}
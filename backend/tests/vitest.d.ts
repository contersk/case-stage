/// <reference types="vitest" />
import type { Assertion, AsymmetricMatchersContaining } from "vitest";

declare global {
  namespace Vi {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

interface CustomMatchers<R = any> {
  // Add custom matchers here if needed
}

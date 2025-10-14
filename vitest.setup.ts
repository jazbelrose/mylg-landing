import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  var jest: {
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    spyOn: typeof vi.spyOn;
  };
}

globalThis.jest = {
  fn: vi.fn,
  mock: vi.mock,
  spyOn: vi.spyOn,
};

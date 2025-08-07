import { describe, it, expect, beforeEach } from 'vitest';
import { extractProps, isTurboAvailable } from '../utils/dom';

describe('DOM utilities', () => {
  describe('extractProps', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should extract props from data-props-* attributes', () => {
      element.setAttribute('data-props-name', 'test');
      element.setAttribute('data-props-count', '42');
      element.setAttribute('data-props-active', 'true');

      const props = extractProps(element);

      expect(props).toEqual({
        name: 'test',
        count: 42,
        active: true,
      });
    });

    it('should convert kebab-case to camelCase', () => {
      element.setAttribute('data-props-long-property-name', 'value');
      element.setAttribute('data-props-another-test-case', 'test');

      const props = extractProps(element);

      expect(props).toEqual({
        longPropertyName: 'value',
        anotherTestCase: 'test',
      });
    });

    it('should parse different value types', () => {
      element.setAttribute('data-props-string-val', 'hello');
      element.setAttribute('data-props-number-val', '123');
      element.setAttribute('data-props-boolean-val', 'false');
      element.setAttribute('data-props-json-val', '{"key": "value"}');
      element.setAttribute('data-props-array-val', '[1, 2, 3]');
      element.setAttribute('data-props-empty-val', '');

      const props = extractProps(element);

      expect(props).toEqual({
        stringVal: 'hello',
        numberVal: 123,
        booleanVal: false,
        jsonVal: { key: 'value' },
        arrayVal: [1, 2, 3],
        emptyVal: '',
      });
    });

    it('should ignore non-props attributes', () => {
      element.setAttribute('class', 'test-class');
      element.setAttribute('id', 'test-id');
      element.setAttribute('data-other', 'other-value');
      element.setAttribute('data-props-valid', 'valid');

      const props = extractProps(element);

      expect(props).toEqual({
        valid: 'valid',
      });
    });

    it('should handle elements without data-props attributes', () => {
      element.setAttribute('class', 'test-class');
      element.setAttribute('id', 'test-id');

      const props = extractProps(element);

      expect(props).toEqual({});
    });

    it('should handle invalid JSON gracefully', () => {
      element.setAttribute('data-props-invalid-json', '{invalid json}');

      const props = extractProps(element);

      expect(props).toEqual({
        invalidJson: '{invalid json}',
      });
    });

    it('should handle complex nested properties', () => {
      element.setAttribute('data-props-deeply-nested-property-name', 'value');

      const props = extractProps(element);

      expect(props).toEqual({
        deeplyNestedPropertyName: 'value',
      });
    });
  });

  describe('isTurboAvailable', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally making window undefined
      delete global.window;

      const result = isTurboAvailable();
      expect(result).toBe(false);

      global.window = originalWindow;
    });

    it('should return false when Turbo is not available', () => {
      const result = isTurboAvailable();
      expect(result).toBe(false);
    });

    it('should return true when Turbo is available', () => {
      // @ts-expect-error - Adding Turbo to window for testing
      global.window.Turbo = {};

      const result = isTurboAvailable();
      expect(result).toBe(true);

      // @ts-expect-error - Cleaning up Turbo from window
      delete global.window.Turbo;
    });

    it('should return false when Turbo exists but is not an object', () => {
      // @ts-expect-error - Adding invalid Turbo to window for testing
      global.window.Turbo = 'not-an-object';

      const result = isTurboAvailable();
      expect(result).toBe(false);

      // @ts-expect-error - Cleaning up Turbo from window
      delete global.window.Turbo;
    });
  });
});

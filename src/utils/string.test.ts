import { describe, it, expect } from 'vitest';
import {
  kebabToCamelCase,
  isBooleanValue,
  parseBooleanValue,
  isEmptyValue,
  isNumericValue,
  isJSONLikeValue,
  parseJSONValue,
  parseValue,
  isEmpty,
} from '../utils/string';

describe('string utilities', () => {
  describe('kebabToCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(kebabToCamelCase('hello-world')).toBe('helloWorld');
      expect(kebabToCamelCase('my-long-property-name')).toBe('myLongPropertyName');
      expect(kebabToCamelCase('single')).toBe('single');
      expect(kebabToCamelCase('')).toBe('');
    });

    it('should handle multiple dashes', () => {
      expect(kebabToCamelCase('a-b-c-d')).toBe('aBCD');
    });

    it('should preserve uppercase letters after conversion', () => {
      expect(kebabToCamelCase('test-api-key')).toBe('testApiKey');
    });
  });

  describe('isBooleanValue', () => {
    it('should return true for boolean strings', () => {
      expect(isBooleanValue('true')).toBe(true);
      expect(isBooleanValue('false')).toBe(true);
    });

    it('should return false for non-boolean strings', () => {
      expect(isBooleanValue('True')).toBe(false);
      expect(isBooleanValue('FALSE')).toBe(false);
      expect(isBooleanValue('yes')).toBe(false);
      expect(isBooleanValue('no')).toBe(false);
      expect(isBooleanValue('1')).toBe(false);
      expect(isBooleanValue('0')).toBe(false);
      expect(isBooleanValue('')).toBe(false);
    });
  });

  describe('parseBooleanValue', () => {
    it('should parse "true" as true', () => {
      expect(parseBooleanValue('true')).toBe(true);
    });

    it('should parse "false" as false', () => {
      expect(parseBooleanValue('false')).toBe(false);
    });

    it('should parse anything else as false', () => {
      expect(parseBooleanValue('True')).toBe(false);
      expect(parseBooleanValue('1')).toBe(false);
      expect(parseBooleanValue('')).toBe(false);
    });
  });

  describe('isEmptyValue', () => {
    it('should return true for empty string', () => {
      expect(isEmptyValue('')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmptyValue(' ')).toBe(false);
      expect(isEmptyValue('hello')).toBe(false);
      expect(isEmptyValue('0')).toBe(false);
    });
  });

  describe('isNumericValue', () => {
    it('should return true for numeric strings', () => {
      expect(isNumericValue('123')).toBe(true);
      expect(isNumericValue('0')).toBe(true);
      expect(isNumericValue('-456')).toBe(true);
      expect(isNumericValue('3.14')).toBe(true);
      expect(isNumericValue('1e5')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isNumericValue('abc')).toBe(false);
      expect(isNumericValue('12a')).toBe(false);
      expect(isNumericValue('hello world')).toBe(false);
    });

    it('should return true for numeric strings with whitespace', () => {
      expect(isNumericValue(' 123 ')).toBe(true); // Whitespace is trimmed by Number()
    });

    it('should return true for empty string (converts to 0)', () => {
      expect(isNumericValue('')).toBe(true); // Empty string converts to 0
    });
  });

  describe('isJSONLikeValue', () => {
    it('should return true for JSON-like strings', () => {
      expect(isJSONLikeValue('{"key": "value"}')).toBe(true);
      expect(isJSONLikeValue('[1, 2, 3]')).toBe(true);
      expect(isJSONLikeValue('{')).toBe(true);
      expect(isJSONLikeValue('[')).toBe(true);
    });

    it('should return false for non-JSON-like strings', () => {
      expect(isJSONLikeValue('hello')).toBe(false);
      expect(isJSONLikeValue('123')).toBe(false);
      expect(isJSONLikeValue('')).toBe(false);
      expect(isJSONLikeValue('true')).toBe(false);
    });
  });

  describe('parseJSONValue', () => {
    it('should parse valid JSON', () => {
      expect(parseJSONValue('{"key": "value"}')).toEqual({ key: 'value' });
      expect(parseJSONValue('[1, 2, 3]')).toEqual([1, 2, 3]);
      expect(parseJSONValue('true')).toBe(true);
      expect(parseJSONValue('null')).toBe(null);
    });

    it('should return the original string for invalid JSON', () => {
      expect(parseJSONValue('invalid json')).toBe('invalid json');
      expect(parseJSONValue('{')).toBe('{');
      expect(parseJSONValue('hello')).toBe('hello');
    });
  });

  describe('parseValue', () => {
    it('should parse empty values as empty string', () => {
      expect(parseValue('')).toBe('');
    });

    it('should parse boolean values', () => {
      expect(parseValue('true')).toBe(true);
      expect(parseValue('false')).toBe(false);
    });

    it('should parse numeric values', () => {
      expect(parseValue('123')).toBe(123);
      expect(parseValue('0')).toBe(0);
      expect(parseValue('-456')).toBe(-456);
      expect(parseValue('3.14')).toBe(3.14);
    });

    it('should parse JSON values', () => {
      expect(parseValue('{"key": "value"}')).toEqual({ key: 'value' });
      expect(parseValue('[1, 2, 3]')).toEqual([1, 2, 3]);
    });

    it('should return string values as-is when they don\'t match other types', () => {
      expect(parseValue('hello')).toBe('hello');
      expect(parseValue('not-a-number')).toBe('not-a-number');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' ')).toBe(false);
      expect(isEmpty('0')).toBe(false);
      expect(isEmpty('false')).toBe(false);
    });
  });
});

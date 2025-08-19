/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Checks if a string value represents a boolean
 */
export function isBooleanValue(value: string): boolean {
  return value === 'true' || value === 'false';
}

/**
 * Parses a boolean value from string
 */
export function parseBooleanValue(value: string): boolean {
  return value === 'true';
}

/**
 * Checks if a string value is empty
 */
export function isEmptyValue(value: string): boolean {
  return value === '';
}

/**
 * Checks if a string value represents a number
 */
export function isNumericValue(value: string): boolean {
  const numValue = Number(value);
  return !Number.isNaN(numValue);
}

/**
 * Checks if a string value looks like JSON
 */
export function isJSONLikeValue(value: string): boolean {
  return value.startsWith('{') || value.startsWith('[');
}

/**
 * Safely parses a JSON string
 */
export function parseJSONValue(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    // Ignore JSON parsing errors, return as string
    return value;
  }
}

type ValueParser = (value: string) => { parsed: unknown; shouldParse: boolean };

const VALUE_PARSERS: ValueParser[] = [
  (value) => ({ 
    parsed: value === 'true', 
    shouldParse: isBooleanValue(value)
  }),
  (value) => ({ 
    parsed: '', 
    shouldParse: isEmptyValue(value)
  }),
  (value) => ({ 
    parsed: Number(value), 
    shouldParse: isNumericValue(value)
  }),
  (value) => ({ 
    parsed: parseJSONValue(value), 
    shouldParse: isJSONLikeValue(value)
  }),
];

/**
 * Safely parses a string value to its appropriate type using a strategy pattern
 */
export function parseValue(value: string): unknown {
  for (const parser of VALUE_PARSERS) {
    const result = parser(value);
    if (result.shouldParse) {
      return result.parsed;
    }
  }
  return value;
}

export function isEmpty(str: string): boolean {
  return !str || str.length === 0;
}

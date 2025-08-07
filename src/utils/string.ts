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

/**
 * Safely parses a string value to its appropriate type
 */
export function parseValue(value: string): unknown {
  if (isBooleanValue(value)) {
    return parseBooleanValue(value);
  }
  if (isEmptyValue(value)) {
    return '';
  }
  if (isNumericValue(value)) {
    return Number(value);
  }
  if (isJSONLikeValue(value)) {
    return parseJSONValue(value);
  }
  return value;
}

export function isEmpty(str: string): boolean {
  return !str || str.length === 0;
}

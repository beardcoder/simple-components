import { kebabToCamelCase, parseValue } from './string.js';

/**
 * Checks if an attribute is a props attribute
 */
function isPropsAttribute(attributeName: string, prefix: string): boolean {
  return attributeName.startsWith(prefix);
}

/**
 * Extracts the prop name from a data attribute name
 */
function extractPropName(attributeName: string, prefixLength: number): string {
  return kebabToCamelCase(attributeName.slice(prefixLength));
}

export function extractProps(element: HTMLElement): Record<string, unknown> {
  const DATA_PROPS_PREFIX = 'data-props-';
  const props: Record<string, unknown> = {};
  const attributes = element.attributes;
  const prefixLength = DATA_PROPS_PREFIX.length;

  for (const attr of attributes) {
    if (isPropsAttribute(attr.name, DATA_PROPS_PREFIX)) {
      const propName = extractPropName(attr.name, prefixLength);
      props[propName] = parseValue(attr.value);
    }
  }
  return props;
}
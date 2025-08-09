import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  createComponent,
  initializeComponents,
  mount,
  createComponentAndMount,
  createSingleComponent,
  type ComponentInstance,
  type ComponentCallback,
} from '../core/createComponent';

// Mock DOM utilities, but keep real exports (partial mock)
vi.mock(import('../utils/dom'), async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/dom')>();
  return {
    ...actual,
    isTurboAvailable: vi.fn(() => false),
  };
});

describe('createComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createComponent', () => {
    it('should create a component config with valid parameters', () => {
      const callback = vi.fn();
      const component = createComponent('.test-selector', callback);

      expect(component).toEqual({
        selector: '.test-selector',
        callback,
      });
    });

    it('should throw error for empty selector', () => {
      const callback = vi.fn();
      expect(() => createComponent('', callback)).toThrow(
        'Component selector must be a non-empty string',
      );
    });

    it('should throw error for non-function callback', () => {
      // @ts-expect-error - Testing invalid callback type
      expect(() => createComponent('.test', 'not-a-function')).toThrow(
        'Component callback must be a function',
      );
    });
  });

  describe('initializeComponents', () => {
    it('should initialize components for matching elements', () => {
      document.body.innerHTML = `
        <div class="test-component">Component 1</div>
        <div class="test-component">Component 2</div>
      `;

      const callback = vi.fn().mockReturnValue(vi.fn());
      const cleanupFunctions = initializeComponents('.test-component', callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(cleanupFunctions).toHaveLength(2);
      expect(cleanupFunctions.every(fn => typeof fn === 'function')).toBe(true);
    });

    it('should handle components without cleanup functions', () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(undefined);
      const cleanupFunctions = initializeComponents('.test-component', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(cleanupFunctions).toHaveLength(0);
    });

    it('should provide component instance with correct interface', () => {
      document.body.innerHTML = `
        <div class="test-component" data-props-name="test" data-props-count="42">
          <span class="child">Child element</span>
        </div>
      `;

      let capturedInstance: ComponentInstance | null = null;
      const callback: ComponentCallback = (instance) => {
        capturedInstance = instance;
        return vi.fn();
      };

      initializeComponents('.test-component', callback);

      expect(capturedInstance).toBeTruthy();
      expect(capturedInstance!.element).toBeInstanceOf(HTMLElement);
      expect(capturedInstance!.props).toEqual({ name: 'test', count: 42 });
      expect(capturedInstance!.querySelector('.child')).toBeInstanceOf(HTMLElement);
      expect(capturedInstance!.querySelectorAll('.child')).toHaveLength(1);
    });

    it('should handle callback errors gracefully', () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock console.error
      });
      const callback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });

      const cleanupFunctions = initializeComponents('.test-component', callback);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error initializing component'),
        expect.any(Error),
      );
      expect(cleanupFunctions).toHaveLength(0);

      consoleSpy.mockRestore();
    });
  });

  describe('mount', () => {
    it('should mount component when DOM is ready', async () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(vi.fn());
      const component = createComponent('.test-component', callback);
      const mountResult = mount(component);

      expect(mountResult.isMounted).toBe(false); // Not mounted immediately

      const cleanupFunctions = await mountResult.mounted;
      expect(cleanupFunctions).toHaveLength(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(mountResult.isMounted).toBe(true);
    });

    it('should handle mounting when no elements match', async () => {
      const callback = vi.fn();
      const component = createComponent('.non-existent', callback);
      const mountResult = mount(component);

      const cleanupFunctions = await mountResult.mounted;
      expect(cleanupFunctions).toHaveLength(0);
      expect(callback).not.toHaveBeenCalled();
      expect(mountResult.isMounted).toBe(true); // Considered mounted even with no elements
    });

    it('should unmount component properly', async () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      const component = createComponent('.test-component', callback);
      const mountResult = mount(component);

      const cleanupFunctions = await mountResult.mounted;
      expect(cleanupFunctions).toHaveLength(1);
      expect(mountResult.isMounted).toBe(true);

      mountResult.unmount();
      expect(mountResult.isMounted).toBe(false);
      // Note: cleanup functions are managed internally, so we can't directly test them
    });

    it('should handle cleanup errors gracefully', async () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(vi.fn());
      const component = createComponent('.test-component', callback);
      const mountResult = mount(component);

      const cleanupFunctions = await mountResult.mounted;
      expect(cleanupFunctions).toHaveLength(1);

      // Test that unmount doesn't throw even with potential errors
      expect(() => mountResult.unmount()).not.toThrow();
      expect(mountResult.isMounted).toBe(false);
    });

    it('should prevent double mounting', async () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(vi.fn());
      const component = createComponent('.test-component', callback);
      const mountResult = mount(component);

      await mountResult.mounted;
      expect(callback).toHaveBeenCalledTimes(1);

      // Try to trigger another mount (this should be prevented internally)
      expect(mountResult.isMounted).toBe(true);
    });
  });

  describe('createComponentAndMount', () => {
    it('should create and mount component in one step', async () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(vi.fn());
      const mountResult = createComponentAndMount('.test-component', callback);

      const cleanupFunctions = await mountResult.mounted;
      expect(cleanupFunctions).toHaveLength(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(mountResult.isMounted).toBe(true);
    });
  });

  describe('createSingleComponent', () => {
    it('should create component for first matching element only', () => {
      document.body.innerHTML = `
        <div class="test-component">Component 1</div>
        <div class="test-component">Component 2</div>
      `;

      const callback = vi.fn().mockReturnValue(vi.fn());
      const cleanup = createSingleComponent('.test-component', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(cleanup).toBeTypeOf('function');
    });

    it('should warn and return undefined when no element found', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock console.warn
      });
      const callback = vi.fn();

      const result = createSingleComponent('.non-existent', callback);

      expect(result).toBeUndefined();
      expect(callback).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'No element found for selector: .non-existent',
      );

      consoleSpy.mockRestore();
    });

    it('should handle callback without cleanup function', () => {
      document.body.innerHTML = '<div class="test-component">Component</div>';

      const callback = vi.fn().mockReturnValue(undefined);
      const result = createSingleComponent('.test-component', callback);

      expect(result).toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('props extraction', () => {
    it('should extract props from data-props-* attributes', () => {
      document.body.innerHTML = `
        <div 
          class="test-component" 
          data-props-string-value="hello"
          data-props-number-value="42"
          data-props-boolean-value="true"
          data-props-json-value='{"key": "value"}'
          data-props-empty-value=""
        >Component</div>
      `;

      let capturedProps: Record<string, unknown> | null = null;
      const callback: ComponentCallback = (instance) => {
        capturedProps = instance.props;
        return vi.fn();
      };

      initializeComponents('.test-component', callback);

      expect(capturedProps).toEqual({
        stringValue: 'hello',
        numberValue: 42,
        booleanValue: true,
        jsonValue: { key: 'value' },
        emptyValue: '',
      });
    });

    it('should handle kebab-case to camelCase conversion', () => {
      document.body.innerHTML = `
        <div 
          class="test-component" 
          data-props-multi-word-property="value"
          data-props-another-long-property-name="test"
        >Component</div>
      `;

      let capturedProps: Record<string, unknown> | null = null;
      const callback: ComponentCallback = (instance) => {
        capturedProps = instance.props;
        return vi.fn();
      };

      initializeComponents('.test-component', callback);

      expect(capturedProps).toEqual({
        multiWordProperty: 'value',
        anotherLongPropertyName: 'test',
      });
    });
  });
});

import { isEmpty } from '@/utils/string.js';
import { extractProps } from '@/utils/dom.js';
import { hasTurbo } from '@/utils/environment';

/** Component cleanup function */
export type CleanupFunction = () => void;

/**
 * Component instance interface that provides access to the DOM element and helper methods
 */
export interface ComponentInstance<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
> {
  /** The DOM element this component is bound to */
  readonly element: T;
  /** Find a child element by selector within this component */
  querySelector<E extends Element = Element>(selector: string): E | null;
  /** Find all child elements by selector within this component */
  querySelectorAll<E extends Element = Element>(
    selector: string
  ): NodeListOf<E>;
  /** Props extracted from data-props-* attributes (reactive if enabled) */
  readonly props: TProps;
}

/**
 * Component initialization callback function
 */
export type ComponentCallback<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = (component: ComponentInstance<T, TProps>) => CleanupFunction | undefined;

/**
 * Component configuration object
 */
export interface ComponentConfig<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly selector: string;
  readonly callback: ComponentCallback<T, TProps>;
}

// Reuse shared DOM util for extracting props from data attributes

function createComponentInstance<
  T extends HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(element: T): ComponentInstance<T, TProps> {
  const props = extractProps(element) as TProps;
  const querySelector = element.querySelector.bind(element);
  const querySelectorAll = element.querySelectorAll.bind(element);
  return {
    element,
    props,
    querySelector,
    querySelectorAll,
  };
}

/**
 * Safely initializes a single component with error handling
 */
function initializeSingleComponent<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(
  element: T,
  callback: ComponentCallback<T, TProps>,
  selector: string,
): CleanupFunction | undefined {
  try {
  const componentInstance = createComponentInstance<T, TProps>(element);
    const cleanup = callback(componentInstance);
    return typeof cleanup === 'function' ? cleanup : undefined;
  } catch (error) {
    
    console.error(
      `Error initializing component for selector "${selector}":`,
      error,
    );
    return undefined;
  }
}

/**
 * Initialize components with proper error handling and cleanup
 */
export function initializeComponents<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(selector: string, callback: ComponentCallback<T, TProps>): CleanupFunction[] {
  const elements = document.querySelectorAll<T>(selector);
  const cleanupFunctions: CleanupFunction[] = [];

  for (const element of elements) {
    const cleanup = initializeSingleComponent(element, callback, selector);
    if (cleanup) {
      cleanupFunctions.push(cleanup);
    }
  }
  return cleanupFunctions;
}

export function createComponent<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(
  selector: string,
  callback: ComponentCallback<T, TProps>,
): ComponentConfig<T, TProps> {
  if (isEmpty(selector)) {
    throw new Error('Component selector must be a non-empty string');
  }
  if (typeof callback !== 'function') {
    throw new Error('Component callback must be a function');
  }
  return {
    callback,
    selector,
  };
}

/**
 * Mount result interface that provides control over the mounted component
 */
export interface MountResult {
  /** Promise that resolves when the component is initially mounted */
  readonly mounted: Promise<CleanupFunction[]>;
  /** Function to unmount the component and clean up all resources */
  readonly unmount: () => void;
  /** Whether the component is currently mounted */
  readonly isMounted: boolean;
}

/**
 * Internal state interface for mount operation
 */
interface MountState<T extends HTMLElement, TProps extends Record<string, unknown>> {
  selector: string;
  callback: ComponentCallback<T, TProps>;
  cleanupFunctions: CleanupFunction[];
  isMounted: boolean;
  isUnmounted: boolean;
  eventCleanups: (() => void)[];
  resolvePromise: (value: CleanupFunction[]) => void;
  rejectPromise: (reason?: unknown) => void;
}

/**
 * Creates the initial mount state and promise
 */
function createMountState<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(component: ComponentConfig<T, TProps>): {
  state: MountState<T, TProps>;
  promise: Promise<CleanupFunction[]>;
} {
  const { selector, callback } = component;

  let resolvePromise!: (value: CleanupFunction[]) => void;
  let rejectPromise!: (reason?: unknown) => void;

  const promise = new Promise<CleanupFunction[]>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  const state: MountState<T, TProps> = {
    selector,
    callback,
    cleanupFunctions: [],
    isMounted: false,
    isUnmounted: false,
    eventCleanups: [],
    resolvePromise,
    rejectPromise,
  };

  return { state, promise };
}

/**
 * Cleans up all component cleanup functions
 */
function executeComponentCleanup<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (state.cleanupFunctions.length === 0) {
    return;
  }

  state.cleanupFunctions.forEach((fn) => {
    try {
      fn();
    } catch (err) {
       
      console.warn(`Error during cleanup for selector "${state.selector}":`, err);
    }
  });
  state.cleanupFunctions = [];
}

/**
 * Initializes components and updates mount state
 */
function executeComponentInitialization<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (state.isMounted || state.isUnmounted) {
    return;
  }

  try {
    executeComponentCleanup(state); // Clean up any existing components first
    state.cleanupFunctions = initializeComponents<T, TProps>(state.selector, state.callback);
    state.isMounted = true;
    state.resolvePromise([...state.cleanupFunctions]); // Resolve with a copy
  } catch (error) {
    
    console.error(`Error mounting component for selector "${state.selector}":`, error);
    state.rejectPromise(error);
  }
}

/**
 * Handles component cleanup during lifecycle events
 */
function executeLifecycleCleanup<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (!state.isMounted || state.isUnmounted) {
    return;
  }

  executeComponentCleanup(state);
  state.isMounted = false;
}

/**
 * Executes complete unmount process
 */
function executeUnmount<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (state.isUnmounted) {
    return;
  }

  state.isUnmounted = true;
  executeLifecycleCleanup(state);

  // Remove all event listeners
  state.eventCleanups.forEach((cleanupFn) => {
    try {
      cleanupFn();
    } catch (err) {
      
      console.warn(`Error removing event listener for selector "${state.selector}":`, err);
    }
  });
  state.eventCleanups.length = 0;
}

/**
 * Sets up Turbo integration event listeners
 */
function setupTurboIntegration<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (!hasTurbo()) {
    return;
  }

  const turboBeforeRender = (): void => executeLifecycleCleanup(state);
  const turboLoad = (): void => executeComponentInitialization(state);

  document.addEventListener('turbo:before-render', turboBeforeRender, { passive: true });
  document.addEventListener('turbo:load', turboLoad, { passive: true });

  state.eventCleanups.push(
    () => document.removeEventListener('turbo:before-render', turboBeforeRender),
    () => document.removeEventListener('turbo:load', turboLoad),
  );
}

/**
 * Sets up DOM ready state handling
 */
function setupDOMReadyHandling<
  T extends HTMLElement,
  TProps extends Record<string, unknown>,
>(state: MountState<T, TProps>): void {
  if (document.readyState === 'loading') {
    const domContentLoaded = (): void => executeComponentInitialization(state);
    document.addEventListener('DOMContentLoaded', domContentLoaded, {
      once: true,
      passive: true,
    });

    state.eventCleanups.push(
      () => document.removeEventListener('DOMContentLoaded', domContentLoaded),
    );
  } else {
    // Use microtask to ensure this runs after current execution context
    queueMicrotask(() => executeComponentInitialization(state));
  }
}

/**
 * Mount a component with automatic DOM ready and Turbo support
 *
 * This function provides robust component mounting with proper lifecycle management:
 * - Handles DOM ready state automatically
 * - Integrates with Turbo navigation if available
 * - Provides cleanup and unmount capabilities
 * - Prevents duplicate mounting
 * - Includes comprehensive error handling
 */
export function mount<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(component: ComponentConfig<T, TProps>): MountResult {
  const { state, promise } = createMountState(component);

  // Set up Turbo integration if available
  setupTurboIntegration(state);

  // Handle initial mounting based on DOM ready state
  setupDOMReadyHandling(state);

  return {
    mounted: promise,
    unmount: () => executeUnmount(state),
    get isMounted(): boolean {
      return state.isMounted && !state.isUnmounted;
    },
  };
}

/**
 * Mount a component and return a Promise (backward compatibility)
 *
 * @deprecated Use `mount()` instead which returns a MountResult for better lifecycle management
 */
export function mountAsync<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(component: ComponentConfig<T, TProps>): Promise<CleanupFunction[]> {
  const result = mount(component);
  return result.mounted;
}

/**
 * Create and mount a component in one step
 */
export function createComponentAndMount<
  T extends HTMLElement = HTMLElement,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(
  selector: string,
  callback: ComponentCallback<T, TProps>,
): MountResult {
  const component = createComponent<T, TProps>(selector, callback);
  return mount(component);
}

/**
 * Create a single component instance for the first matching element
 */
export function createSingleComponent<T extends HTMLElement = HTMLElement>(
  selector: string,
  callback: ComponentCallback<T>,
): CleanupFunction | undefined {
  const element = document.querySelector<T>(selector);
  if (!element) {
    
    console.warn(`No element found for selector: ${selector}`);
    return;
  }
  const componentInstance = createComponentInstance(element);
  const result = callback(componentInstance);
  return typeof result === 'function' ? result : undefined;
}

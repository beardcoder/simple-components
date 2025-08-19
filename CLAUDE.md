# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `bun run build` - Compiles TypeScript to ESM/CJS with type definitions
- **Development**: `bun run dev` - Watch mode build for development
- **Testing**: `bun run test` - Run all tests with Vitest
- **Test Watch**: `bun run test:watch` - Run tests in watch mode
- **Test UI**: `bun run test:ui` - Launch Vitest UI
- **Test Coverage**: `bun run test:coverage` - Generate test coverage report
- **Lint**: `bun run lint` - Check code with ESLint
- **Format**: `bun run format` - Format code with ESLint auto-fix
- **Release**: `bun run release` - Format and publish to npm

## Architecture Overview

This is a lightweight vanilla JavaScript/TypeScript component library that provides:

### Core Component System (`src/core/createComponent.ts`)

- **Component Creation**: `createComponent(selector, callback)` defines reusable components
- **Mounting**: `mount(component)` handles DOM ready state and Turbo navigation
- **Props System**: Automatic extraction from `data-props-*` attributes using `extractProps()`
- **Lifecycle Management**: Automatic cleanup, error handling, and Turbo integration
- **TypeScript**: Fully typed with generic support for element types and props

### Hooks System (`src/hooks/`)

- **Signals**: `useSignal()` - reactive state with pub/sub pattern
- **Effects**: `useEffect()` - side effects with dependency tracking
- **Storage**: `useLocalStorage()` - reactive localStorage with reset capability
- **Media Queries**: `useMediaQuery()` - reactive CSS media query matching
- **Color Scheme**: `usePreferredColorScheme()` - system color preference detection
- **Document Language**: `useDocumentLanguage()` - document language detection

### Utilities (`src/utils/`)

- **DOM Utils**: Element props extraction, Turbo detection
- **String Utils**: kebabToCamelCase conversion, value parsing

## Key Patterns

### Component Definition

```typescript
const MyComponent = createComponent('.selector', ({ element, props }) => {
  // Component logic here
  return () => {
    // Cleanup function (optional)
  };
});

const { mounted, unmount, isMounted } = mount(MyComponent);
```

### Signal-Based Reactivity

```typescript
const counter = useSignal(0);
counter.subscribe((value) => console.log(value));
counter.value++; // Triggers subscribers
```

### Props from Data Attributes

Elements with `data-props-count="5"` become `props.count: 5` in components.

## Testing Setup

- **Framework**: Vitest with happy-dom environment
- **Setup**: `src/test/setup.ts` configures test environment
- **Pattern**: Co-located `.test.ts` files alongside source files
- **Coverage**: Excludes test files, dist, and node_modules

## Build Configuration

- **TypeScript**: Path alias `@/*` maps to `src/*`
- **Bundler**: tsup for dual ESM/CJS output with type definitions
- **Target**: Modern ESM with CJS fallback for compatibility
- **Minification**: Enabled for production builds

## Package Management

Uses bun for dependency management. The package is published as `@beardcoder/simple-components` with public access.

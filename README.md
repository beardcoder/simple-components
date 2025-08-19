# @beardcoder/simple-components

Minimal, dependency-free, and interactive UI component API for vanilla JS/TS projects.

## Features

- Minimal, composable UI component API
- Reactivity and hooks (e.g. `useLocalStorage`, `useMediaQuery`)
- TypeScript-first, ESM/CJS compatible
- No dependencies, fast and tree-shakeable

## Installation

```sh
bun add @beardcoder/simple-components
pnpm add @beardcoder/simple-components
npm i @beardcoder/simple-components
```

## Usage

### Create a component

```js
import { createComponent, mount } from '@beardcoder/simple-components';

const MyComponent = createComponent('.my-button', ({ element }) => {
  element.addEventListener('click', () => alert('Hello!'));
});

mount(MyComponent);
```

### useLocalStorage

```js
import { useLocalStorage } from '@beardcoder/simple-components';

const counter = useLocalStorage('counter', 0);
counter.value++; // persists to localStorage
counter.reset(); // resets to initial value and removes from localStorage
```

### useMediaQuery

```js
import { useMediaQuery } from '@beardcoder/simple-components';

const isDark = useMediaQuery('(prefers-color-scheme: dark)');
console.log('Dark mode?', isDark);
```

### usePreferredColorScheme

```js
import { usePreferredColorScheme } from '@beardcoder/simple-components';

const scheme = usePreferredColorScheme();
console.log('Preferred color scheme:', scheme); // 'dark', 'light', or 'no-preference'
```

## Development

Install dependencies:

```sh
bun install
```

Build the package:

```sh
bun run build
```

Start development mode (watch):

```sh
bun run dev
```

Format code:

```sh
bun run format
```

## Release

To build, format, and publish a new release:

```sh
bun run release
```

## License

MIT

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

or

```js
import { createComponentAndMount } from '@beardcoder/simple-components';

createComponentAndMount('.my-button', ({ element }) => {
  element.addEventListener('click', () => alert('Hello!'));
});
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

Conventional commits drive automatic versioning and changelog.

1. Make conventional commits (feat:, fix:, chore:, docs:, refactor:, perf:, test:). Major bumps come from commits containing `BREAKING CHANGE:`.

2. Cut a release (bumps version, updates CHANGELOG.md, creates a git tag):

```sh
bun run release              # auto-detect version from commits
# or explicitly
bun run release:patch        # 0.4.1
bun run release:minor        # 0.5.0
bun run release:major        # 1.0.0
bun run release:prerelease   # 1.0.0-rc.0
```

3. Push tags and publish to npm:

```sh
bun run release:publish
```

Notes:

- The release scripts run format, tests, and build before tagging.
- Ensure you’re on a clean git branch with all changes committed.

## License

MIT

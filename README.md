# Data Structure Visualizer

Allows the user to construct a binary tree and change values.

_Project goal: A "Swiss Army knife" for students and educators to easily create diagrams and problem inputs (e.g. leetcode) for common data structures, notably trees and graphs._

## Features

- Construct binary tree
- Modify node values
- Node deletion + pruning
- Undo-redo
- Convert back and forth between tree and leetcode string

## Roadmap

- Implement persistent storage
- Layout/visual settings
- Visualize traversal algorithms
- Graph editor

## Tech

- [React TypeScript]() - Frontend
- [React Flow]() - Node based library
- [Zustand]() - State management

### Other dependencies

- [d3-hierarchy]() - Layouting library for tree-like structures
- [clsx]() - Enables construction of conditional `className` strings
- [zundo]() - Middleware provides support for temporal state management (undo/redo)
- [react-hotkeys-hook]() - Enables hotkey listening
## Run Locally

Clone the project

```bash
  git clone git@github.com:arthur-schevey/ds-visualizer.git
```

Go to the project directory

```bash
  cd ds-visualizer
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Style

- ESLint to enforce code quality with eslint-plugin-only-warn to reduce noise/false alarms
- _Optional: prettier with default config_

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

# Data Structure Visualizer

Allows the user to construct a binary tree and change values.

_Project goal: A "Swiss Army knife" for students and educators to easily create diagrams and problem inputs (e.g. leetcode) for common data structures, notably trees and graphs._

## Table of Contents
- [Features](#features)
- [Roadmap](#roadmap)
- [Tech](#tech)
- [Installation](#run-locally)
- [Style Guide](#style)
- [Docs](#docs)
  - [Project Structure](#project-structure)
  - [Layout System](#layouting)
  - [State Management](#state-management)
- [License](#license)

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
- [React Router]() - Enables pagination
- [Zustand]() - State management + Local storage persistence

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

## Docs
### Project Structure
The project structure has not matured enough to document yet.
### Layouting
#### Binary Tree Layout
By default, `d3-hierarchy` lays out a lone child directly below the parent as seen in the left tree. In order to circumvent this behavior to look more like a binary tree, we must give each node *without* a sibling a "dummy" sibling during the layouting procedure. Leaf nodes must not have any dummy children to prevent "spreading" out the tree.

![Left tree: single left child is positioned directly below root. Right tree: single left child is positioned to the left as you would expect for a binary tree, due to an invisible dummy node acting as the right child.](public/tree-layout-demo.png)

Additionally, d3-hierarchy will order children as they are recieved, so it is important to distinguish a lone left child from a lone right child by placing the dummy node accordingly.

#### Graph Layout
Not yet implemented. The layout will be decided by the user. There may be an option to use d3-force once implemented.

### State Management
Uses Zustand for state management. Each app within the project should have its own store independent of other apps. 

We create a helper for each store called `use<AppName>Store` for the purpose of chaining middleware like `persist` for local storage persistence, `devtools` for use with Redux devtools browser extension, and `temporal` for enabling undo/redo. Otherwise, all store logic and initialization will be found in `create<AppName>Store`.

When using the store, all we need is `const state = useTreeStore()`. However, in most cases, we'll want a `selector` to subscribe to desired parts of the store to prevent unnecessary rerenders. Additionally, it's important to use `useShallow(selector)` if the selector returns an object (which it almost always does) to prevent excessive rerenders and weird behavior.

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

# v2

## Requirements

- [Node.js](https://nodejs.org/) 18 or higher (includes `npm`)

## Install

```bash
npm install
```

## How to run

```bash
npm run dev
```

This starts a local dev server (by default at `http://localhost:5173`, or the next free
port if that one is already in use) with hot-reload. Open the URL shown in the terminal.

To force a specific port:

```bash
npm run dev -- --port 5182
```

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the production bundle into `dist/` |
| `npm run preview` | Serves the already-built `dist/` content locally |
| `npm run lint` | Runs the linter |

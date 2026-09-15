# transpilacao

This folder contains two standalone projects: `v1` and `v2`.

## Requirements

- [Node.js](https://nodejs.org/) 18 or higher (includes `npm`)

## v1

```bash
cd v1
npm install
npm run dev
```

To force a specific port:

```bash
npm run dev -- --port 5181
```

## v2

```bash
cd v2
npm install
npm run dev
```

To force a specific port:

```bash
npm run dev -- --port 5182
```

## Other commands

Run inside either project's folder:

| Command | What it does |
|---|---|
| `npm run build` | Builds the production bundle into `dist/` |
| `npm run preview` | Serves the already-built `dist/` content locally |
| `npm run lint` | Runs the linter |

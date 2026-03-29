# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Specifications
If needed, see the file `./SPECS.md` to list all the software specifications, where you can find information about:
- Milestones
- Data structures
- TODO lists

## Development environment
The development environment for this project runs in a docker container.

### To start the development environment
```bash
docker-compose build && docker-compose up
```

### To run commands in the development environment
First find the application container with 
```bash
docker ps
```
The output will be similar to:
```
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                                         NAMES
87176261af68   drummer_app   "docker-entrypoint.s…"   40 seconds ago   Up 40 seconds   0.0.0.0:4200->4200/tcp, [::]:4200->4200/tcp   drummer_app_1
```
The container named `drummer_app_1` is the one containing the application.

Then enter the container and run the desired commands, like in this example:
```shell
docker exec -ti 87176261af68 bash
npm test
```

## Commands
These commands are available once entered the application docker: container
```bash
npm start          # Dev server at http://localhost:4200 (auto-reloads)
npm run build      # Production build to dist/
npm run watch      # Build with watch mode (for iterative dev)
npm test           # Run unit tests with Vitest
```

To run a single test file:
```bash
npx ng test --include="src/app/path/to/file.spec.ts"
```

## Architecture

This is a standalone Angular 21 app bootstrapped via `bootstrapApplication()` (no NgModules).

- **Entry point:** `src/main.ts` → bootstraps `App` with `appConfig`
- **Root config:** `src/app/app.config.ts` — providers (router, error listeners)
- **Routes:** `src/app/app.routes.ts` — top-level route definitions
- **Styles:** Global SCSS at `src/styles.scss`; per-component SCSS files alongside `.ts`
- **Assets:** Static files go in `public/`

### Key conventions
- Test runner is **Vitest** (not Karma/Jest) — test files use `.spec.ts` suffix
- Component style language is **SCSS**
- Formatter is **Prettier** with `printWidth: 100` and single quotes

### Development guidelines
Detailed Angular, TypeScript, accessibility, and state management guidelines are in `.claude/CLAUDE.md` — Claude Code loads this automatically.

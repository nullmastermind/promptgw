# promptgw

Prompt Gateway CLI - A command-line tool for prompt management.

## Installation

Install globally via npm:

```bash
npm install -g promptgw
```

Or use with npx:

```bash
npx promptgw
```

## Usage

After installation, you can run the CLI using:

```bash
promptgw
```

## Development

### Prerequisites

- [Bun](https://bun.com) v1.2.23 or higher

### Setup

Install dependencies:

```bash
bun install
```

### Build

Build the project:

```bash
bun run build
```

### Code Quality

Run linter and typecheck:

```bash
bun run check
```

Or run them separately:

```bash
bun run lint      # Run biome linter/formatter
bun run typecheck # Run TypeScript type checking
```

### Local Testing

Test the CLI locally:

```bash
bun run src/index.ts
```

Or test the built version:

```bash
node dist/index.js
```

## Publishing to npm

1. Make sure you're logged in to npm:

```bash
npm login
```

2. Update the version in `package.json` following [semantic versioning](https://semver.org/)

3. Build and publish:

```bash
npm publish
```

The `prepublishOnly` script will automatically build the project before publishing.

## Project Structure

```
promptgw/
├── src/
│   └── index.ts       # Main entry point
├── dist/              # Built output (generated)
├── biome.json         # Biome linter/formatter config
├── package.json       # Package configuration
├── tsconfig.json      # TypeScript configuration
└── AGENTS.md          # Development guidelines
```

## License

MIT

# Prompt Gateway CLI

A command-line interface tool to retrieve and manage prompts from Augment Gateway.

## Features

- 🔐 Secure authentication token management
- 📥 Fetch all prompts from the API with automatic pagination
- 🎨 Beautiful TUI (Terminal User Interface) using @clack/prompts
- 💾 Save prompts to local `.augment/rules/` directory
- 🚀 Support for multiple platforms (Augment, Cursor, Qoder)

## Installation

```bash
# Install globally
npm install -g promptgw

# Or use with bunx
bunx promptgw
```

## Usage

Simply run the command:

```bash
promptgw
```

### First Time Setup

1. Run `promptgw`
2. Enter your authentication token when prompted
3. Token will be saved to `~/.promptgw/auth.json` for future use

### Workflow

1. **Authentication**: The CLI checks for an existing token in `~/.promptgw/auth.json`
   - If not found, you'll be prompted to enter your token
   - Token is securely saved for future sessions

2. **Platform Selection**: Choose from:
   - **Augment** - Fetches and saves prompts to `.augment/rules/[command].md`
   - **Cursor** - Coming soon
   - **Qoder** - Coming soon

3. **Fetch & Save**:
   - Automatically fetches all prompts from all pages
   - Saves each prompt to a separate markdown file named after the command
   - Files are saved to `process.cwd()/.augment/rules/`

## API Endpoint

The CLI connects to: `https://augmentgateway.1app.space/prompts`

## File Structure

```
~/.promptgw/
  └── auth.json          # Stored authentication token

<project-directory>/
  └── .augment/
      └── rules/
          ├── review.md
          ├── code.md
          ├── deepcode.md
          └── ...
```

## Development

```bash
# Install dependencies
bun install

# Run type checking and linting
bun run check

# Build the project
bun run build

# Test locally
bun run dist/index.js
```

## Scripts

- `bun run build` - Build the TypeScript source to JavaScript
- `bun run lint` - Run Biome linter with auto-fix
- `bun run typecheck` - Run TypeScript type checking
- `bun run check` - Run both lint and typecheck

## License

MIT

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

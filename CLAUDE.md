# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prompt Gateway CLI (`@dccxx/promptgw`) is a command-line tool that synchronizes AI coding prompts from an API to local AI coding assistant platforms. It fetches prompts from `augmentgateway.1app.space` and saves them to platform-specific directories with appropriate formatting and frontmatter.

**Supported platforms:**
- Augment (`.augment/rules/*.md`)
- Cursor Rules (`.cursor/rules/*.mdc`)
- Cursor Commands (`.cursor/commands/*.md`)
- Qoder (`.qoder/rules/*.md`)
- Factory Droids (`.factory/droids/*.md`)
- Factory Commands (`.factory/commands/*.md`)

## Development Commands

```bash
# Run the CLI in development mode
bun run dev

# Lint and format code (uses Biome)
bun run lint

# Type check (uses TypeScript)
bun run typecheck

# Run both lint and typecheck - REQUIRED before commits
bun run check

# Build for production
bun run build
```

## Architecture

### Single File Structure

The entire application is contained in `src/index.ts` with these key components:

**Authentication Flow:**
- Token stored in `~/.promptgw/auth.json`
- If missing, prompts user and saves for future use
- Token used as Bearer auth for API requests

**Data Flow:**
1. Fetch all prompts from API (paginated, 15 per page)
2. Present sorted list with multiselect UI
3. User selects specific prompts or all
4. Save to selected platform(s) with proper formatting
5. Optionally commit changes with timestamped message

**Platform-Specific Processing:**
- `getTargetDirectory()` - Maps platform to directory path
- `getFileExtension()` - Returns `.mdc` for cursor-rules, `.md` for others
- `getFrontmatter()` - Generates platform-specific YAML frontmatter
- `replacePlatformPaths()` - Transforms content for platform conventions

**Commit Conventions:**
- Single platform: `chore: sync {Platform} rules (YYYY-MM-DD)`
- All platforms: `chore: sync all platform rules (YYYY-MM-DD)`

### Key Data Structures

```typescript
interface Prompt {
  id: string;
  username: string;
  name: string;
  command: string;      // Used as filename
  content: string;      // Prompt body
  tags: string[];
  status: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    prompts: Prompt[];
  };
}
```

## Code Quality Rules (from AGENTS.md)

### Comments
- Explain "what" (business logic/purpose) and "why" (reasoning behind decisions)
- Code should be self-explanatory for "how"
- Avoid over-commenting; prefer refactoring unclear code
- Function comments explain purpose and reasoning only

### Code Principles
- Readability over optimization
- Simple solutions over unnecessary complexity
- Follow Linus Torvalds' principles: keep it obvious, minimize abstractions, implement only what's needed now
- No unused code - everything written must be utilized

### Implementation Workflow
1. Understand data structures first before any implementation
2. Define all data input/output structures
3. Define all function signatures (parameters and return values)
4. Define all required functions at once
5. Write implementation logic last
6. Avoid over-engineering - deliver minimal viable solution
7. Only create tests if explicitly required

### Quality Gates
- **ALWAYS run `bun run check` after writing code**
- Must pass both Biome linter and TypeScript typecheck
- NEVER use `biome --unsafe` - manually fix all errors
- Code incomplete until both checks pass

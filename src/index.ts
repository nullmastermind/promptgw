#!/usr/bin/env node

import { exec } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import * as p from '@clack/prompts';

const execAsync = promisify(exec);

interface Prompt {
  id: string;
  username: string;
  name: string;
  command: string;
  content: string;
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

const AUTH_DIR = join(homedir(), '.promptgw');
const AUTH_FILE = join(AUTH_DIR, 'auth.json');
const API_BASE_URL = 'https://augmentgateway.1app.space';

async function getAuthToken(): Promise<string> {
  if (existsSync(AUTH_FILE)) {
    try {
      const authData = JSON.parse(readFileSync(AUTH_FILE, 'utf-8'));
      if (authData.token) {
        return authData.token;
      }
    } catch (error) {
      console.error('Error reading auth file:', error);
    }
  }

  const token = await p.text({
    message: 'Enter your authentication token:',
    placeholder: 'Bearer token...',
    validate: (value) => {
      if (!value) return 'Token is required';
      return undefined;
    },
  });

  if (p.isCancel(token)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true });
  }

  writeFileSync(AUTH_FILE, JSON.stringify({ token }, null, 2));
  p.note(`Token saved to ${AUTH_FILE}`, 'Success');

  return token as string;
}

async function fetchAllPrompts(token: string): Promise<Prompt[]> {
  const allPrompts: Prompt[] = [];
  let page = 1;
  const limit = 15;

  const spinner = p.spinner();
  spinner.start('Fetching prompts from API...');

  try {
    while (true) {
      const response = await fetch(`${API_BASE_URL}/prompts?page=${page}&limit=${limit}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = (await response.json()) as ApiResponse;

      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }

      const prompts = data.data.prompts;

      if (!prompts || prompts.length === 0) {
        break;
      }

      allPrompts.push(...prompts);
      spinner.message(`Fetching page ${page}... (${allPrompts.length} prompts so far)`);

      if (prompts.length < limit) {
        break;
      }

      page++;
    }

    spinner.stop(`Successfully fetched ${allPrompts.length} prompts`);
    return allPrompts;
  } catch (error) {
    spinner.stop('Failed to fetch prompts');
    throw error;
  }
}

function getFrontmatter(platform: string, promptName: string): string {
  switch (platform) {
    case 'augment':
      return `---
type: "manual"
description: ${JSON.stringify(promptName)}
---`;
    case 'qoder':
      return `---
trigger: manual
description: ${JSON.stringify(promptName)}
---`;
    case 'cursor-rules':
    case 'cursor-commands':
      return `---
alwaysApply: false
description: ${JSON.stringify(promptName)}
---`;
    case 'factory-droids':
    case 'factory-commands':
      return `---
description: ${JSON.stringify(promptName)}
---`;
    case 'claude':
      return `---
description: ${JSON.stringify(promptName)}
---`;
    default:
      return `---
type: "manual"
description: ${JSON.stringify(promptName)}
---`;
  }
}

type Scope = 'global' | 'workspace';

function getTargetDirectory(platform: string, scope: Scope): string {
  const basePath = scope === 'global' ? homedir() : process.cwd();

  switch (platform) {
    case 'augment':
      return join(basePath, '.augment', 'rules');
    case 'qoder':
      return join(basePath, '.qoder', 'rules');
    case 'cursor-rules':
      return join(basePath, '.cursor', 'rules');
    case 'cursor-commands':
      return join(basePath, '.cursor', 'commands');
    case 'factory-droids':
      return join(basePath, '.factory', 'droids');
    case 'factory-commands':
      return join(basePath, '.factory', 'commands');
    case 'claude':
      return join(basePath, '.claude', 'commands');
    default:
      return join(basePath, '.augment', 'rules');
  }
}

function getFileExtension(platform: string): string {
  if (platform === 'cursor-rules') return 'mdc';
  return 'md';
}

function replacePlatformPaths(content: string, platform: string): string {
  let result = content;

  switch (platform) {
    case 'augment':
      result = result.replace(/\.cursor\/rules\//g, '.augment/rules/');
      result = result.replace(/\.cursor\/commands\//g, '.augment/rules/');
      result = result.replace(/\.qoder\/rules\//g, '.augment/rules/');
      result = result.replace(/\.factory\/droids\//g, '.augment/rules/');
      result = result.replace(/\.factory\/commands\//g, '.augment/rules/');
      result = result.replace(/\.claude\/commands\//g, '.augment/rules/');
      break;
    case 'cursor-rules':
      result = result.replace(/\.augment\/rules\//g, '.cursor/rules/');
      result = result.replace(/\.cursor\/commands\//g, '.cursor/rules/');
      result = result.replace(/\.qoder\/rules\//g, '.cursor/rules/');
      result = result.replace(/\.factory\/droids\//g, '.cursor/rules/');
      result = result.replace(/\.factory\/commands\//g, '.cursor/rules/');
      result = result.replace(/\.claude\/commands\//g, '.cursor/rules/');
      break;
    case 'cursor-commands':
      result = result.replace(/\.augment\/rules\//g, '.cursor/commands/');
      result = result.replace(/\.cursor\/rules\//g, '.cursor/commands/');
      result = result.replace(/\.qoder\/rules\//g, '.cursor/commands/');
      result = result.replace(/\.factory\/droids\//g, '.cursor/commands/');
      result = result.replace(/\.factory\/commands\//g, '.cursor/commands/');
      result = result.replace(/\.claude\/commands\//g, '.cursor/commands/');
      break;
    case 'qoder':
      result = result.replace(/\.augment\/rules\//g, '.qoder/rules/');
      result = result.replace(/\.cursor\/rules\//g, '.qoder/rules/');
      result = result.replace(/\.cursor\/commands\//g, '.qoder/rules/');
      result = result.replace(/\.factory\/droids\//g, '.qoder/rules/');
      result = result.replace(/\.factory\/commands\//g, '.qoder/rules/');
      result = result.replace(/\.claude\/commands\//g, '.qoder/rules/');
      break;
    case 'factory-droids':
      result = result.replace(/\.augment\/rules\//g, '.factory/droids/');
      result = result.replace(/\.cursor\/rules\//g, '.factory/droids/');
      result = result.replace(/\.cursor\/commands\//g, '.factory/droids/');
      result = result.replace(/\.qoder\/rules\//g, '.factory/droids/');
      result = result.replace(/\.factory\/commands\//g, '.factory/droids/');
      result = result.replace(/\.claude\/commands\//g, '.factory/droids/');
      break;
    case 'factory-commands':
      result = result.replace(/\.augment\/rules\//g, '.factory/commands/');
      result = result.replace(/\.cursor\/rules\//g, '.factory/commands/');
      result = result.replace(/\.cursor\/commands\//g, '.factory/commands/');
      result = result.replace(/\.qoder\/rules\//g, '.factory/commands/');
      result = result.replace(/\.factory\/droids\//g, '.factory/commands/');
      result = result.replace(/\.claude\/commands\//g, '.factory/commands/');
      break;
    case 'claude':
      result = result.replace(/\.augment\/rules\//g, '.claude/commands/');
      result = result.replace(/\.cursor\/rules\//g, '.claude/commands/');
      result = result.replace(/\.cursor\/commands\//g, '.claude/commands/');
      result = result.replace(/\.qoder\/rules\//g, '.claude/commands/');
      result = result.replace(/\.factory\/droids\//g, '.claude/commands/');
      result = result.replace(/\.factory\/commands\//g, '.claude/commands/');
      break;
  }

  return result;
}

async function savePrompts(prompts: Prompt[], platform: string, scope: Scope): Promise<void> {
  const targetDir = getTargetDirectory(platform, scope);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const spinner = p.spinner();
  spinner.start('Saving prompts...');

  let savedCount = 0;
  const fileExtension = getFileExtension(platform);
  for (const prompt of prompts) {
    const filename = `${prompt.command}.${fileExtension}`;
    const filepath = join(targetDir, filename);

    const frontmatter = getFrontmatter(platform, prompt.name);
    const processedContent = replacePlatformPaths(prompt.content, platform);
    const fileContent = `${frontmatter}

${processedContent}`;

    writeFileSync(filepath, fileContent, 'utf-8');
    savedCount++;
    spinner.message(`Saved ${savedCount}/${prompts.length} prompts...`);
  }

  spinner.stop(`Successfully saved ${savedCount} prompts to ${targetDir}`);
}

async function commitPrompts(platform: string): Promise<void> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const spinner = p.spinner();
  spinner.start('Committing changes...');

  try {
    if (platform === 'all') {
      await execAsync(
        'git add .augment/rules .cursor/rules .cursor/commands .qoder/rules .factory/droids .factory/commands .claude/commands',
      );
      const commitMessage = `chore: sync all platform rules (${year}-${month}-${day})`;
      await execAsync(`git commit -m "${commitMessage}"`);
    } else {
      const platformName =
        platform === 'factory-droids'
          ? 'Factory Droids'
          : platform === 'factory-commands'
            ? 'Factory Commands'
            : platform === 'cursor-rules'
              ? 'Cursor Rules'
              : platform === 'cursor-commands'
                ? 'Cursor Commands'
                : platform === 'claude'
                  ? 'ClaudeCode'
                  : platform.charAt(0).toUpperCase() + platform.slice(1);
      const commitMessage = `chore: sync ${platformName} rules (${year}-${month}-${day})`;

      const rulesPath =
        platform === 'augment'
          ? '.augment/rules'
          : platform === 'qoder'
            ? '.qoder/rules'
            : platform === 'cursor-rules'
              ? '.cursor/rules'
              : platform === 'cursor-commands'
                ? '.cursor/commands'
                : platform === 'factory-droids'
                  ? '.factory/droids'
                  : platform === 'factory-commands'
                    ? '.factory/commands'
                    : '.claude/commands';

      await execAsync(`git add ${rulesPath}`);
      await execAsync(`git commit -m "${commitMessage}"`);
    }
    spinner.stop('Successfully committed changes');
  } catch (error) {
    spinner.stop('Failed to commit changes');
    throw error;
  }
}

async function main() {
  console.clear();

  p.intro('🚀 Prompt Gateway CLI');

  const token = await getAuthToken();

  const platform = await p.select({
    message: 'Select a platform:',
    options: [
      { value: 'all', label: 'All (Augment + Cursor + Qoder + Factory + ClaudeCode)' },
      { value: 'augment', label: 'Augment' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'qoder', label: 'Qoder' },
      { value: 'factory-droids', label: 'Factory Droids' },
      { value: 'factory-commands', label: 'Factory Commands' },
      { value: 'claude', label: 'ClaudeCode' },
    ],
  });

  if (p.isCancel(platform)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  let selectedPlatform = platform as string;

  // Prompt for Cursor subdirectory selection when Cursor platform is chosen
  if (platform === 'cursor') {
    const cursorSubdir = await p.select({
      message: 'Select Cursor subdirectory:',
      options: [
        { value: 'cursor-rules', label: 'Rules (.cursor/rules with .mdc extension)' },
        { value: 'cursor-commands', label: 'Commands (.cursor/commands with .md extension)' },
      ],
    });

    if (p.isCancel(cursorSubdir)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    selectedPlatform = cursorSubdir as string;
  }

  try {
    const prompts = await fetchAllPrompts(token);

    // Sort prompts alphabetically by command for easier selection
    const sortedPrompts = [...prompts].sort((a, b) => a.command.localeCompare(b.command));

    // Ask user which prompts to sync
    const selectedPrompts = await p.multiselect({
      message: 'Select prompts to sync (use space to select, enter to confirm):',
      options: [
        { value: 'all', label: 'All prompts', hint: `Sync all ${prompts.length} prompts` },
        ...sortedPrompts.map((prompt) => ({
          value: prompt.id,
          label: `${prompt.command} - ${prompt.name}`,
          hint: prompt.name,
        })),
      ],
      required: true,
    });

    if (p.isCancel(selectedPrompts)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Determine which prompts to save
    const promptsToSave = (selectedPrompts as string[]).includes('all')
      ? prompts
      : prompts.filter((prompt) => (selectedPrompts as string[]).includes(prompt.id));

    if (promptsToSave.length === 0) {
      p.log.warn('No prompts selected');
      p.outro('⚠️ No prompts were saved');
      process.exit(0);
    }

    // Ask user for scope (global or workspace)
    const scope = await p.select({
      message: 'Select scope for saving rules:',
      options: [
        { value: 'workspace', label: 'Workspace', hint: 'Save to current working directory' },
        {
          value: 'global',
          label: 'Global',
          hint: 'Save to home directory (e.g., ~/.claude/commands/)',
        },
      ],
    });

    if (p.isCancel(scope)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    const selectedScope = scope as Scope;

    if (platform === 'all') {
      await savePrompts(promptsToSave, 'augment', selectedScope);
      await savePrompts(promptsToSave, 'cursor-rules', selectedScope);
      await savePrompts(promptsToSave, 'cursor-commands', selectedScope);
      await savePrompts(promptsToSave, 'qoder', selectedScope);
      await savePrompts(promptsToSave, 'factory-droids', selectedScope);
      await savePrompts(promptsToSave, 'factory-commands', selectedScope);
      await savePrompts(promptsToSave, 'claude', selectedScope);
    } else {
      await savePrompts(promptsToSave, selectedPlatform, selectedScope);
    }

    // Only offer commit option for workspace scope (git operations not applicable for global rules)
    if (selectedScope === 'workspace') {
      const shouldCommit = await p.confirm({
        message: 'Do you want to commit these changes?',
        initialValue: false,
      });

      if (p.isCancel(shouldCommit)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      if (shouldCommit) {
        try {
          // Use original platform value for 'all', otherwise use selectedPlatform
          const commitPlatform = platform === 'all' ? 'all' : selectedPlatform;
          await commitPrompts(commitPlatform);
          p.outro('✅ All prompts have been saved and committed successfully!');
        } catch (error) {
          p.log.warn('Prompts saved but commit failed');
          p.log.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
          p.outro('⚠️ Prompts saved but not committed');
        }
      } else {
        p.outro('✅ All prompts have been saved successfully!');
      }
    } else {
      p.outro('✅ All prompts have been saved to global directory successfully!');
    }
  } catch (error) {
    p.log.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    p.outro('❌ Operation failed');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

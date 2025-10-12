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

async function saveAugmentPrompts(prompts: Prompt[]): Promise<void> {
  const targetDir = join(process.cwd(), '.augment', 'rules');

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const spinner = p.spinner();
  spinner.start('Saving prompts...');

  let savedCount = 0;
  for (const prompt of prompts) {
    const filename = `${prompt.command}.md`;
    const filepath = join(targetDir, filename);

    const fileContent = `---
type: "manual"
description: "${prompt.name}"
---

${prompt.content}`;

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

  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
  const commitMessage = `chore: sync ${platformName} rules (${year}-${month}-${day})`;

  const spinner = p.spinner();
  spinner.start('Committing changes...');

  try {
    await execAsync('git add .augment/rules');
    await execAsync(`git commit -m "${commitMessage}"`);
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
      { value: 'augment', label: 'Augment' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'qoder', label: 'Qoder' },
    ],
  });

  if (p.isCancel(platform)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  if (platform === 'cursor' || platform === 'qoder') {
    p.note('This feature is coming soon!', 'Coming Soon');
    p.outro('Thank you for using Prompt Gateway CLI');
    return;
  }

  try {
    const prompts = await fetchAllPrompts(token);
    await saveAugmentPrompts(prompts);

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
        await commitPrompts(platform as string);
        p.outro('✅ All prompts have been saved and committed successfully!');
      } catch (error) {
        p.log.warn('Prompts saved but commit failed');
        p.log.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        p.outro('⚠️ Prompts saved but not committed');
      }
    } else {
      p.outro('✅ All prompts have been saved successfully!');
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

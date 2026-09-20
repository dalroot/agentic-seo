#!/usr/bin/env node

import { program } from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('agentic-seo')
  .description('CLI to interact with Agentic SEO rules engine')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Agentic SEO for a specific AI agent')
  .option('--ai <agent>', 'Specify the AI agent (e.g., antigravity, cursor)')
  .action((options) => {
    console.log(`Initializing SEO Pro Max for AI agent: ${options.ai || 'default'}`);
    // Future implementation: copy templates to the current workspace
    console.log('Done.');
  });

program
  .command('search')
  .description('Search SEO rules, frameworks, and anti-patterns')
  .option('--industry <industry>', 'Filter by industry')
  .option('--framework <framework>', 'Filter by framework')
  .option('--anti-patterns', 'List anti-patterns')
  .action((options) => {
    try {
      const scriptPath = path.join(__dirname, '..', 'src', 'agentic_seo', 'scripts', 'search.py');
      const args = [scriptPath];
      
      if (options.industry) args.push('--industry', String(options.industry));
      if (options.framework) args.push('--framework', String(options.framework));
      if (options.antiPatterns) args.push('--anti-patterns');

      const result = spawnSync('python3', args, { encoding: 'utf-8' });
      if (result.error) {
        console.error('Error executing search script:', result.error.message);
      } else if (result.status !== 0) {
        if (result.stderr) console.error(result.stderr);
      } else {
        console.log(result.stdout);
      }
    } catch (error) {
      console.error('Error executing search script:', error.message);
    }
  });

program.parse(process.argv);

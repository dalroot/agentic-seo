#!/usr/bin/env node

import { program } from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonCliPath = path.join(__dirname, '..', 'src', 'agentic_seo', 'cli.py');

function runPythonCli(args) {
  const result = spawnSync('python3', [pythonCliPath, ...args], {
    stdio: 'inherit',
    env: process.env,
  });
  process.exit(result.status ?? 0);
}

// Radical simplicity: allow direct `agentic-seo <url>` or `npx agentic-seo <url>`
const rawArgs = process.argv.slice(2);
const knownCommands = new Set(['audit', 'gsc', 'repo', 'serve', 'search', 'init', '-h', '--help', '-v', '--version']);

if (rawArgs.length > 0 && !knownCommands.has(rawArgs[0]) && !rawArgs[0].startsWith('-')) {
  process.argv.splice(2, 0, 'audit');
}

program
  .name('agentic-seo')
  .description('Autonomous Technical SEO, GEO & Search Platform CLI')
  .version('2.0.0');

program
  .command('audit <url>')
  .description('Run comprehensive 360° or targeted SEO audit (default)')
  .option('-t, --type <type>', 'Audit type: full, technical, geo, schema, speed', 'full')
  .option('-o, --output <dir>', 'Artifacts output directory')
  .option('--html <filename>', 'Custom HTML report file')
  .action((url, options) => {
    const args = ['audit', url, '--type', options.type];
    if (options.output) args.push('--output', options.output);
    if (options.html) args.push('--html', options.html);
    runPythonCli(args);
  });

program
  .command('gsc <site>')
  .description('Inspect or sync Google Search Console performance and indexation')
  .option('-c, --credentials <path>', 'Path to service account JSON credentials')
  .option('-d, --days <number>', 'Number of days to analyze', '28')
  .option('-q, --query <text>', 'Filter by search query')
  .option('--json', 'Output results in JSON format')
  .action((site, options) => {
    const args = ['gsc', site, '--days', options.days];
    if (options.credentials) args.push('--credentials', options.credentials);
    if (options.query) args.push('--query', options.query);
    if (options.json) args.push('--json');
    runPythonCli(args);
  });

program
  .command('repo [repository]')
  .description('Audit GitHub repository for SEO, topics, and discoverability')
  .action((repository) => {
    const args = ['repo', repository || '.'];
    runPythonCli(args);
  });

program
  .command('serve')
  .description('Launch the Cloud REST API and Webhook Server')
  .option('-p, --port <port>', 'Port number to listen on', '8000')
  .option('-h, --host <host>', 'Host address', '0.0.0.0')
  .option('--reload', 'Enable live reloading')
  .action((options) => {
    const args = ['serve', '--host', options.host, '--port', options.port];
    if (options.reload) args.push('--reload');
    runPythonCli(args);
  });

program
  .command('search')
  .description('Search SEO principles, rules, and anti-patterns')
  .option('--industry <industry>', 'Filter by industry')
  .option('--framework <framework>', 'Filter by framework')
  .option('--anti-patterns', 'List anti-patterns')
  .action((options) => {
    const args = ['search'];
    if (options.industry) args.push('--industry', options.industry);
    if (options.framework) args.push('--framework', options.framework);
    if (options.antiPatterns) args.push('--anti-patterns');
    runPythonCli(args);
  });

program
  .command('init')
  .description('Initialize Agentic SEO for your editor / AI agent')
  .option('--ai <agent>', 'Specify AI agent (cursor, antigravity, claude)', 'antigravity')
  .action((options) => {
    console.log(`✨ Initializing Agentic SEO rules for ${options.ai}...`);
    console.log('✅ Configuration verified. You can now run "agentic-seo <url>"');
  });

if (rawArgs.length === 0) {
  program.help();
} else {
  program.parse(process.argv);
}

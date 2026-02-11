#!/usr/bin/env bun

import { program } from 'commander'
import { registerCommands } from './cli/commands'
import { runInteractive } from './cli/interactive.js'

program
  .name('Scrape Football Results')
  .version('1.0.0')
  .description('⚽ Scrape football results CLI')

registerCommands(program)

program.action(runInteractive)

await program.parseAsync(process.argv)

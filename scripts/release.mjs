#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const rl = createInterface({ input, output })

function run(cmd) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function section(label) {
  console.log(`\n── ${label} ${'─'.repeat(Math.max(0, 48 - label.length))}`)
}

try {
  section('Git status')
  run('git status')

  section('Inputs')
  const message = (await rl.question('Commit message: ')).trim()
  if (!message) {
    console.error('Error: commit message cannot be empty.')
    process.exit(1)
  }

  const tag = (await rl.question('Tag/version (e.g. v0.6.0): ')).trim()
  if (!tag) {
    console.error('Error: tag cannot be empty.')
    process.exit(1)
  }

  rl.close()

  section('Staging')
  run('git add .')

  section('Commit')
  run(`git commit -m ${JSON.stringify(message)}`)

  section('Tag')
  run(`git tag ${tag}`)

  section('Push commits')
  run('git push')

  section('Push tags')
  run('git push --tags')

  console.log(`\n✓ Released ${tag}\n`)
} catch (err) {
  rl.close()
  console.error(`\nRelease failed: ${err.message}`)
  process.exit(1)
}

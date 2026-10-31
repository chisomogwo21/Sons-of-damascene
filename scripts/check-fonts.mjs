#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const FONTS_DIR = path.resolve(process.cwd(), 'public', 'fonts')
const REQUIRED_FONTS = [
  'BespokeStencil-Bold.woff2',
  'Supreme-Regular.woff2',
]

const MIN_SIZE_BYTES = 5 * 1024 // 5 KB
const MAGIC_BYTES = 'wOF2'

let hasError = false

console.log('Verifying licensed font files in public/fonts/...')

for (const fontName of REQUIRED_FONTS) {
  const fontPath = path.join(FONTS_DIR, fontName)

  if (!fs.existsSync(fontPath)) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Font file missing: ${fontPath}`)
    console.error(`Ensure ${fontName} is restored from repository secrets or placed in public/fonts/ before building.`)
    hasError = true
    continue
  }

  let stat
  try {
    stat = fs.statSync(fontPath)
  } catch (err) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed to stat font file: ${fontPath}`, err)
    hasError = true
    continue
  }

  if (stat.size < MIN_SIZE_BYTES) {
    console.error(
      `\x1b[31m[ERROR]\x1b[0m Font file too small (${stat.size} bytes < ${MIN_SIZE_BYTES} bytes): ${fontName}`
    )
    hasError = true
    continue
  }

  try {
    const fd = fs.openSync(fontPath, 'r')
    const buffer = Buffer.alloc(4)
    fs.readSync(fd, buffer, 0, 4, 0)
    fs.closeSync(fd)

    const header = buffer.toString('utf8')
    if (header !== MAGIC_BYTES) {
      console.error(
        `\x1b[31m[ERROR]\x1b[0m Font file does not start with valid wOF2 magic bytes (got "${header}"): ${fontName}`
      )
      hasError = true
      continue
    }
  } catch (err) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed reading header from font file: ${fontName}`, err)
    hasError = true
    continue
  }

  console.log(`✓ ${fontName} (${(stat.size / 1024).toFixed(1)} KB, valid wOF2)`)
}

if (hasError) {
  console.error('\n\x1b[31mBuild halted:\x1b[0m One or more required licensed font files failed validation.')
  console.error('To protect site typography, builds require valid BespokeStencil-Bold.woff2 and Supreme-Regular.woff2.')
  process.exit(1)
}

console.log('✓ All required font files verified successfully.\n')

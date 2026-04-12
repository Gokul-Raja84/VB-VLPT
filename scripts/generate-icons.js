import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const svg = readFileSync('public/icon.svg')

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`)
  console.log(`✓ icon-${size}x${size}.png`)
}

// Apple touch icon (180px, no rounded corners — iOS adds them)
await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('✓ apple-touch-icon.png')

// Favicon
await sharp(svg).resize(32, 32).png().toFile('public/favicon.png')
console.log('✓ favicon.png')

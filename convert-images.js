import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

async function convertImages() {
  const images = [
    { input: 'hand_brah.png', output: 'hand_brah.webp' },
    { input: 'middle_no_gem.png', output: 'middle_no_gem.webp' }
  ];

  for (const image of images) {
    const inputPath = path.join(publicDir, image.input);
    const outputPath = path.join(publicDir, image.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ Skipped ${image.input} - file not found`);
      continue;
    }

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

      const inputSize = fs.statSync(inputPath).size / 1024;
      const outputSize = fs.statSync(outputPath).size / 1024;
      const savings = (100 - (outputSize / inputSize) * 100).toFixed(1);

      console.log(`✓ ${image.input} → ${image.output}`);
      console.log(`  Size: ${inputSize.toFixed(0)}KB → ${outputSize.toFixed(0)}KB (saved ${savings}%)\n`);
    } catch (error) {
      console.error(`✗ Failed to convert ${image.input}:`, error.message);
    }
  }
}

convertImages();

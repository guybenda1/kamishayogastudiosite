import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://eyotdvabnyowlmdqctsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5b3RkdmFibnlvd2xtZHFjdHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDY1NzUsImV4cCI6MjA2ODcyMjU3NX0.qK1svcHvwn8UdPcnj2cjA4DG1RNxC9I_43oypwOFdQo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadJewelryImages() {
  const images = [
    { file: 'hand_brah.png', name: 'BRAHMCARYA Bracelet' },
    { file: 'middle_no_gem.png', name: 'SATYA Ring' }
  ];

  for (const image of images) {
    try {
      const filePath = path.join(__dirname, 'public', image.file);
      const fileData = fs.readFileSync(filePath);

      const fileName = `${Date.now()}-${image.file}`;
      const storagePath = `jewelry/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(storagePath, fileData, {
          contentType: 'image/png',
          cacheControl: '31536000',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(storagePath);

      console.log(`✓ Uploaded ${image.name}: ${data.publicUrl}`);
    } catch (error) {
      console.error(`✗ Failed to upload ${image.file}:`, error.message);
    }
  }
}

uploadJewelryImages();

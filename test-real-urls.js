const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, 
  { auth: { persistSession: false } });

(async () => {
  try {
    // Get a product with images
    const { data: product } = await supabase
      .from('products')
      .select('id, name, images')
      .ilike('name', '%ASUS TUF%')
      .limit(1);

    if (!product || !product[0]) {
      console.log('No product found');
      process.exit(1);
    }

    const p = product[0];
    console.log(`Product: ${p.name}\n`);

    let images = [];
    if (Array.isArray(p.images)) {
      images = p.images;
    } else if (typeof p.images === 'string') {
      try {
        images = JSON.parse(p.images);
      } catch {}
    }

    if (!images || images.length === 0) {
      console.log('No images found');
      process.exit(1);
    }

    console.log(`Testing ${images.length} image URLs:\n`);

    for (let i = 0; i < Math.min(3, images.length); i++) {
      const url = images[i];
      console.log(`URL ${i + 1}: ${url.substring(0, 80)}...`);
      
      try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`  Status: ${res.status} ${res.statusText}`);
        console.log(`  Content-Type: ${res.headers.get('content-type')}`);
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
      console.log();
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
})();

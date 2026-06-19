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
    const { data: product } = await supabase
      .from('products')
      .select('id, name, images')
      .ilike('name', '%ASUS TUF Gaming A15%')
      .limit(1);

    if (product && product[0]) {
      const p = product[0];
      console.log('Product:', p.name);
      console.log('\nImage URLs:');
      if (Array.isArray(p.images)) {
        p.images.forEach((url, i) => {
          console.log(`${i + 1}. ${url.substring(0, 80)}...`);
        });
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
})();

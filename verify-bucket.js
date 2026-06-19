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
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError.message);
      process.exit(1);
    }
    
    console.log('Buckets:');
    buckets.forEach(b => {
      console.log(`- ${b.name} (public: ${b.public})`);
    });

    // Check if product-images bucket exists
    const productImagesBucket = buckets.find(b => b.name === 'product-images');
    if (!productImagesBucket) {
      console.log('\n⚠️  product-images bucket DOES NOT EXIST');
    } else {
      console.log(`\n✓ product-images bucket exists (public: ${productImagesBucket.public})`);
      
      // List files in the bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('product-images')
        .list('', { limit: 10 });
        
      if (filesError) {
        console.log('Error listing files:', filesError.message);
      } else {
        console.log(`Files in bucket: ${files.length}`);
        files.slice(0, 5).forEach(f => console.log(`  - ${f.name}`));
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
})();

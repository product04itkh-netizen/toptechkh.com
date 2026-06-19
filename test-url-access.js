const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.head(url, { timeout: 5000 }, (res) => {
      console.log(`✓ ${url.substring(0, 60)}...`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      resolve(true);
    }).on('error', (err) => {
      console.log(`✗ ${url.substring(0, 60)}...`);
      console.log(`  Error: ${err.message}`);
      resolve(false);
    });
  });
}

(async () => {
  // Test a real file URL with explicit path
  const filename = '1781841336757-7fq4dhmd1r6.webp';
  const bucket = 'product-images';
  const projectId = 'jywrxrppixektvlnlffz';
  const url = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  
  console.log('Testing file URL:');
  await testUrl(url);
})();

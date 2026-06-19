const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

(async () => {
  console.log('Removing duplicate Home entry from navigation_items...\n');

  const { data, error } = await supabase
    .from('navigation_items')
    .delete()
    .eq('label', 'Home')
    .eq('type', 'custom_link');

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Duplicate Home entry removed!');
})();

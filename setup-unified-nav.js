const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

(async () => {
  console.log('Setting up unified navigation system...\n');

  // 1. Get existing custom nav items
  const { data: customItems } = await supabase
    .from('cms_navigation')
    .select('*')
    .order('position');

  // 2. Get categories to add to nav
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, show_in_nav, nav_order')
    .order('nav_order');

  // 3. Get highest position from custom items
  const maxPos = customItems && customItems.length > 0
    ? Math.max(...customItems.map(i => i.position))
    : -1;

  let position = maxPos + 1;

  // 4. Prepare all nav items
  const navItems = [];

  // Add custom items first
  if (customItems) {
    navItems.push(...customItems.map(item => ({
      type: 'custom_link',
      label: item.label,
      url: item.url,
      category_id: null,
      position: item.position,
      visible: item.visible,
    })));
  }

  // Add categories
  if (categories) {
    categories.forEach(cat => {
      if (cat.show_in_nav) {
        navItems.push({
          type: 'category',
          label: cat.name,
          url: null,
          category_id: cat.id,
          position: position++,
          visible: true,
        });
      }
    });
  }

  // Add Build PC
  navItems.push({
    type: 'build_pc',
    label: 'Build PC',
    url: '/build-pc',
    category_id: null,
    position: position++,
    visible: true,
  });

  // Add Promotion
  navItems.push({
    type: 'promotion',
    label: 'Promotion',
    url: '/shop?sale=true',
    category_id: null,
    position: position++,
    visible: true,
  });

  console.log(`Total items to add: ${navItems.length}`);
  navItems.forEach((item, i) => {
    console.log(`  ${i + 1}. [${item.type}] ${item.label} (pos: ${item.position})`);
  });

  // 5. Insert into navigation_items table
  const { error } = await supabase
    .from('navigation_items')
    .insert(navItems);

  if (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }

  console.log('\n✅ Unified navigation items created successfully!');
})();

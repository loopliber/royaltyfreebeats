#!/usr/bin/env node

/**
 * Component Migration Script
 * Updates Base44 imports to Supabase imports in React components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to update
const filesToUpdate = [
  'src/components/beats/BeatCard.jsx',
  'src/components/beats/ShoppingCart.jsx',
  'src/components/beats/SearchFilters.jsx',
  'src/pages/Browse.jsx',
  'src/pages/Profile.jsx',
  'src/pages/upload.jsx',
  'src/App.jsx'
];

// Migration mappings
const migrations = [
  // Import replacements
  {
    from: /import\s+{\s*([^}]*)\s*}\s+from\s+['"][^'"]*\/api\/entities['"];?\s*\n?/g,
    to: '// Migrated: Base44 entities replaced with Supabase client\n'
  },
  {
    from: /import\s+{\s*([^}]*)\s*}\s+from\s+['"][^'"]*\/api\/functions['"];?\s*\n?/g,
    to: '// Migrated: Base44 functions replaced with Vercel API routes\n'
  },
  {
    from: /import\s+{\s*([^}]*)\s*}\s+from\s+['"][^'"]*\/api\/base44Client['"];?\s*\n?/g,
    to: 'import { db, auth } from \'../api/supabaseClient.js\';\n'
  },
  
  // Common entity method replacements
  {
    from: /Beat\.find\(\)/g,
    to: 'db.beats.getAll()'
  },
  {
    from: /Beat\.findById\(([^)]+)\)/g,
    to: 'db.beats.getById($1)'
  },
  {
    from: /Beat\.create\(([^)]+)\)/g,
    to: 'db.beats.create($1)'
  },
  {
    from: /User\.getUser\(\)/g,
    to: 'auth.getUser()'
  },
  {
    from: /User\.signIn\(([^)]+)\)/g,
    to: 'auth.signIn($1)'
  },
  {
    from: /User\.signUp\(([^)]+)\)/g,
    to: 'auth.signUp($1)'
  },
  {
    from: /User\.signOut\(\)/g,
    to: 'auth.signOut()'
  },
  {
    from: /Purchase\.find\(\)/g,
    to: 'db.purchases.getByUser(userId)'
  },
  {
    from: /BeatLike\.toggle\(([^)]+)\)/g,
    to: 'db.beatLikes.toggle(userId, $1)'
  },
  
  // Function call replacements
  {
    from: /createCheckoutSession\(([^)]+)\)/g,
    to: 'fetch(\'/api/create-checkout-session\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify($1) })'
  },
  {
    from: /generateLicensePDF\(([^)]+)\)/g,
    to: 'fetch(\'/api/generate-license-pdf\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify({ purchaseId: $1 }) })'
  }
];

function migrateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  console.log(`🔄 Migrating ${filePath}...`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    // Apply all migrations
    migrations.forEach(migration => {
      const newContent = content.replace(migration.from, migration.to);
      if (newContent !== content) {
        hasChanges = true;
        content = newContent;
      }
    });
    
    if (hasChanges) {
      // Create backup
      const backupPath = fullPath + '.backup';
      fs.writeFileSync(backupPath, fs.readFileSync(fullPath));
      
      // Write migrated content
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Migrated ${filePath} (backup: ${filePath}.backup)`);
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting component migration from Base44 to Supabase...\n');
  
  filesToUpdate.forEach(migrateFile);
  
  console.log('\n✅ Component migration completed!');
  console.log('\n📋 Manual steps still needed:');
  console.log('1. Review all migrated files for any custom logic');
  console.log('2. Update any remaining Base44-specific code');
  console.log('3. Test all functionality thoroughly');
  console.log('4. Update environment variables');
  console.log('5. Deploy to Vercel');
}

// Run the script
main();

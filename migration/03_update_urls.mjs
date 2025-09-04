#!/usr/bin/env node

/**
 * URL Update Script
 * Updates Base44 file URLs to Cloudflare R2 URLs in exported CSV files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const R2_BASE_URL = 'https://royalty-free-beats-storage.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com';
const BASE44_DOMAIN = 'base44.app'; // Adjust this to match your Base44 domain

function updateUrlsInCsv(filePath, audioFolder = 'audio', coverFolder = 'covers') {
  console.log(`Processing ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update audio URLs
    content = content.replace(
      new RegExp(`https://[^,]*${BASE44_DOMAIN}[^,]*\\.(mp3|wav|m4a)`, 'g'),
      (match) => {
        const filename = path.basename(match);
        return `${R2_BASE_URL}/${audioFolder}/${filename}`;
      }
    );
    
    // Update cover art URLs  
    content = content.replace(
      new RegExp(`https://[^,]*${BASE44_DOMAIN}[^,]*\\.(jpg|jpeg|png|webp)`, 'g'),
      (match) => {
        const filename = path.basename(match);
        return `${R2_BASE_URL}/${coverFolder}/${filename}`;
      }
    );
    
    // Write updated content
    const backupPath = filePath.replace('.csv', '_backup.csv');
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    fs.writeFileSync(filePath, content);
    
    console.log(`✅ Updated ${filePath} (backup saved as ${backupPath})`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔄 Starting URL update process...\n');
  
  // Update this to match your R2 account ID
  if (R2_BASE_URL.includes('YOUR_ACCOUNT_ID')) {
    console.error('❌ Please update the R2_BASE_URL in this script with your actual Cloudflare account ID');
    process.exit(1);
  }
  
  const dataDir = path.join(__dirname, 'data');
  
  // Process beats.csv (contains both audio and cover URLs)
  const beatsFile = path.join(dataDir, 'beats.csv');
  if (fs.existsSync(beatsFile)) {
    updateUrlsInCsv(beatsFile);
  } else {
    console.log('⚠️  beats.csv not found - skipping');
  }
  
  // Process any other CSV files that might contain URLs
  const otherFiles = ['blog_posts.csv', 'users.csv'];
  otherFiles.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      updateUrlsInCsv(filePath, 'images', 'avatars');
    }
  });
  
  console.log('\n✅ URL update process completed!');
  console.log('📋 Next steps:');
  console.log('1. Upload your files to Cloudflare R2 with the folder structure used above');
  console.log('2. Import the updated CSV files to Supabase');
}

// Run the script
main();

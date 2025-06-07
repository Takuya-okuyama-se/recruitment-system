// Script to update all HTML files to use demo-data-fixed.js
const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
const files = fs.readdirSync('.').filter(file => file.endsWith('.html'));

console.log(`Found ${files.length} HTML files to update`);

let updatedCount = 0;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Check if file contains demo-data.js
        if (content.includes('demo-data.js')) {
            // Replace demo-data.js with demo-data-fixed.js
            const updatedContent = content.replace(
                /<script src="demo-data\.js"><\/script>/g,
                '<script src="demo-data-fixed.js"></script>'
            );
            
            if (content \!== updatedContent) {
                fs.writeFileSync(file, updatedContent, 'utf8');
                console.log(`✅ Updated: ${file}`);
                updatedCount++;
            }
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log(`\n✨ Update complete\! ${updatedCount} files updated.`);
console.log('\nNext steps:');
console.log('1. Test locally to ensure demo mode works');
console.log('2. Commit and push changes to git');
console.log('3. Deploy to Vercel');
console.log('4. Test on Vercel deployment with ?demo parameter');
EOF < /dev/null

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'D:\\Libraries\\Downloads\\Portfolio';
const targetDir = 'C:\\Users\\juanj\\.gemini\\antigravity\\scratch\\portfolio\\public\\media';
const jsonPath = 'C:\\Users\\juanj\\.gemini\\antigravity\\scratch\\portfolio\\src\\data\\portfolio.json';

const largeFiles = [
    '[PRIMER] Snappy Hands 2023.pdf',
    'Chain of Smiles.mp4',
    'Drop off Complete!.mp4',
    'Whats in our POSH FINAL.mp4'
];

// We know the categories from before
const categories = {
    'Graphics': 'Design',
    'IEC Materials': 'IEC Materials',
    'Video Teasers': 'Video',
    'Videos from Community Health Project': 'Video'
};

const healthCommCategories = [
    'IEC Materials',
    'Videos from Community Health Project'
];

let portfolioData = [];

function walkAndCopy(currentSource, currentTarget, categoryName) {
    if (!fs.existsSync(currentTarget)) {
        fs.mkdirSync(currentTarget, { recursive: true });
    }

    const items = fs.readdirSync(currentSource);

    for (const item of items) {
        const sourcePath = path.join(currentSource, item);
        const targetPath = path.join(currentTarget, item);
        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            walkAndCopy(sourcePath, targetPath, item);
        } else {
            // Check if it's a large file
            const isLarge = largeFiles.includes(item);
            
            // Generate public URL path
            const relativePath = targetPath.split('public')[1].replace(/\\/g, '/');
            
            let url = relativePath;
            if (isLarge) {
                // Placeholder for google drive link later
                url = 'GOOGLE_DRIVE_LINK_PENDING';
            } else {
                // Copy the file
                fs.copyFileSync(sourcePath, targetPath);
            }

            // Determine if Health Comm
            const isHealthComm = categoryName && healthCommCategories.includes(categoryName);
            const mainCategory = categoryName ? categories[categoryName] || categoryName : 'Other';

            portfolioData.push({
                id: item,
                title: item.replace(/\.[^/.]+$/, ""), // remove extension
                category: mainCategory,
                isHealthCommunication: isHealthComm,
                url: url,
                type: item.endsWith('.mp4') ? 'video' : (item.endsWith('.pdf') ? 'document' : 'image'),
                originalCategory: categoryName
            });
        }
    }
}

console.log('Starting copy and mapping...');
if (!fs.existsSync(path.dirname(jsonPath))) {
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
}

walkAndCopy(sourceDir, targetDir, null);

fs.writeFileSync(jsonPath, JSON.stringify(portfolioData, null, 2));
console.log('Done! Generated JSON data.');

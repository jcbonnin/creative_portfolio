const fs = require('fs');
const path = require('path');

const jsonPath = 'C:\\Users\\juanj\\.gemini\\antigravity\\scratch\\portfolio\\src\\data\\portfolio.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const driveLinks = {
    'Drop off Complete!.mp4': '1Ll7IRhcfU9I9iu00aNdHWpofFsD5YRUl',
    'Whats in our POSH FINAL.mp4': '1yyW8gBxjaqsINSuWHPuFCV5Cxq5s0EDo',
    'Chain of Smiles.mp4': '1E_KHUe_IggTm0wb5zDELWwGVFPuAc7yR'
};

data = data.map(item => {
    if (driveLinks[item.id]) {
        item.url = `https://drive.google.com/file/d/${driveLinks[item.id]}/preview`;
        item.isGoogleDrive = true;
    } else if (item.id === '[PRIMER] Snappy Hands 2023.pdf') {
        item.url = '/media/IEC Materials/[PRIMER] Snappy Hands 2023.pdf';
    }
    return item;
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('Fixed JSON');

const fs = require('fs');

const originalData = JSON.parse(fs.readFileSync('C:\\Users\\juanj\\.gemini\\antigravity\\scratch\\portfolio\\src\\data\\portfolio.json', 'utf8'));

// Map original IDs to items to easily find them
const itemMap = {};
originalData.forEach(item => {
    // some IDs have extensions in JSON, some don't. In the previous copy_and_map, id was the full filename with extension.
    // wait, copy_and_map.js did: id: item (full filename).
    // Let's strip extensions for matching if needed.
    const idWithoutExt = item.id.replace(/\.[^/.]+$/, "");
    itemMap[idWithoutExt] = item;
});

const groupedData = [
    {
        title: "UPV PH Pub Merchandise Collection",
        description: "Apparel and merchandise designs including shirts and tote bags for the UPV Public Health Pub.",
        category: "Design",
        isHealthCommunication: false, // user said except merch
        type: "gallery",
        items: [itemMap["1 (2)"], itemMap["2 (2)"], itemMap["5 (1)"]].filter(Boolean)
    },
    {
        title: "Leila De Lima Symposium Campaign",
        description: "Event publicity materials and plaque design for the Leila De Lima Symposium.",
        category: "Design",
        isHealthCommunication: true, // Assuming symposium on public health/rights? User said "all of the PH Pub Work also comes into Health Comm, except the merch". But is this PH Pub? We'll assume yes if not specified, or just leave it. The user said "all of the PH Pub Work". Let's check titles.
        type: "gallery",
        items: [itemMap["1"], itemMap["6"], itemMap["9"]].filter(Boolean)
    },
    {
        title: "Project YOUHUM: Launch Posters",
        description: "Official event posters for Phase 1 and Phase 2 launches of Project YOUHUM.",
        category: "Design",
        isHealthCommunication: true,
        type: "gallery",
        items: [itemMap["D-DAY - EVENT POSTER (1)"], itemMap["D-DAY - EVENT POSTER (4)"]].filter(Boolean)
    },
    {
        title: "Project YOUHUM: Meet the Team",
        description: "Team introduction publicity materials for Project YOUHUM.",
        category: "Design",
        isHealthCommunication: true,
        type: "gallery",
        items: [itemMap["MEET THE TEAM"], itemMap["JJ"]].filter(Boolean)
    },
    {
        title: "Project YOUHUM: Teaser Series",
        description: "Promotional teaser videos for the launch of Project YOUHUM.",
        category: "Video",
        isHealthCommunication: true,
        type: "gallery",
        items: [itemMap["TEASER 1"], itemMap["Teaser 2"]].filter(Boolean)
    },
    {
        title: "LSG Branding & Event Campaigns",
        description: "Various promotional materials including Buwan ng Wika, 80s Live Event, Christmas Benefit Concert, and Podcast teasers.",
        category: "Design",
        isHealthCommunication: false,
        type: "gallery",
        items: [
            itemMap["53fe6f_265f08995e5c401683ecee795da11632~mv2"],
            itemMap["53fe6f_1f5dbaec1c384039acd623b3e3d32538~mv2"],
            itemMap["53fe6f_571246bafc0b4c23bb19a900163e5619~mv2"],
            itemMap["53fe6f_a805b3a1050a432ebc801e4d151540eb~mv2"],
            itemMap["53fe6f_ade023087e094a8786f616b45b2414bf~mv2"]
        ].filter(Boolean)
    },
    {
        title: "LSG Intramurals Launch Videos",
        description: "Cinematic launch videos for the 2021 and 2022 LSG Intramurals.",
        category: "Video",
        isHealthCommunication: false,
        type: "gallery",
        items: [
            itemMap["AQMyNjRhQslBr-BO0TEP05vVALP0NCQQRvTG_0eKEFkeDNHJT1uGxwAa2OEptnwmb7G_qi5ddOPenWGd1o737PDAitEgpZDqnodi1Nup5SuqYQ"],
            itemMap["AQNmIwjsCAu63G-QWA2s2nYHKktqDACjZ4WeBEsyOAl4OgigBMrsZW6OsmSBymCxAj2q7L0s5z-xgkclGrLhR3-G4g7-vGc3crg6FQEPLeIhVw"]
        ].filter(Boolean)
    }
];

const singleMappings = {
    "11": { title: "Dengue Public Safety Advisory", isHealthCommunication: true },
    "13": { title: "News Release Publication", isHealthCommunication: true },
    "14": { title: "Film Screening Announcement", isHealthCommunication: false },
    "8.1 Committees Applications": { title: "UPV PH Pub Committees Applications", isHealthCommunication: true },
    "Design 2": { title: "Project YOUHUM Polo Shirt Design", isHealthCommunication: true }, // Not PH Pub merch, it's YOUHUM, but is it health comm? Let's say yes, it's part of the project.
    "NSD Statement": { title: "National Students' Day Statement", isHealthCommunication: false },
    "PH PUB AKWE POSTER": { title: "UPV PH Pub Acquaintance Party Poster", isHealthCommunication: true },
    "Snappy Hands Vertical Tarp (1)": { title: "Snappy Hands Flagship Event Tarp", isHealthCommunication: true },
    "The PHinal Section  Poster": { title: "UPV PH Batch 2022 Internship Culminating Activity", isHealthCommunication: true },
    "World-Heart-Day": { title: "World Heart Day Event Tarp", isHealthCommunication: true },
    
    // IEC
    "DENTAL HEALTH POSTERS (1)": { title: "Dental Health IEC Materials (Hiligaynon)", isHealthCommunication: true },
    "FINAL Project YOUHUM POSH": { title: "Project YOUHUM Oral Health Booklet", isHealthCommunication: true },
    "Foldable Fan": { title: "Educational Foldable Fan", isHealthCommunication: true },
    "PH 188 Policy Brief": { title: "Policy Brief on Rabies Prevention", isHealthCommunication: true },
    "Project YOUHUM Booklet 3-6 (1)": { title: "Oral Health Booklet for Kids", isHealthCommunication: true },
    "Project YOUHUM Denta Guide 101 (1)": { title: "Oral Health Information for BHWs", isHealthCommunication: true },
    "SP Poster": { title: "Health Research Poster", isHealthCommunication: true },
    "[PRIMER] Snappy Hands 2023": { title: "Snappy Hands Flagship Event Primer", isHealthCommunication: true },

    // Videos
    "AQNZbJSkkxoGwwYeMN1KSCO1IB_8SstaBPj4buzX3y3eN0vt16Y-ygNSo1jPMPXhy-ixzRjuGikyocIX4aSGSmkcXbtHINKSy7tFZGqQSn0EzA": { title: "LSG Prayer Advocacy Teaser", isHealthCommunication: false },
    "AQPh-fLarAnTBl4iah59uj7OgxXY9efOaT3SBrwUDTVyM7FCWbjLs1DQRVJ9M1iJjfSkF6bqLtCq6fX6_xLXffQRkDYO5L0kch53nFWQsZknYA": { title: "LSG House Sorting Event Trailer", isHealthCommunication: false },
    "banners reel": { title: "PMB Advocacy Video", isHealthCommunication: true },
    "PMB CAS ELEX REEL 2_2": { title: "PMB Election Campaign Video", isHealthCommunication: false },
    "UPV PH Pub - LNK Promotional Video_1": { title: "UPV PH Pub Promotional Video", isHealthCommunication: true },
    
    // Comm Health Videos
    "Chain of Smiles": { title: "Project YOUHUM Publicity Initiative", isHealthCommunication: true },
    "Drop off Complete!": { title: "Project YOUHUM Phase 1 Culminating", isHealthCommunication: true },
    "Whats in our POSH FINAL": { title: "Project YOUHUM Oral Booklet Exhibit", isHealthCommunication: true }
};

// Track which items are grouped
const groupedIds = new Set();
groupedData.forEach(group => {
    group.items.forEach(item => {
        if(item) groupedIds.add(item.id.replace(/\.[^/.]+$/, ""));
    });
});

const finalData = [...groupedData];

originalData.forEach(item => {
    const idWithoutExt = item.id.replace(/\.[^/.]+$/, "");
    if (!groupedIds.has(idWithoutExt)) {
        const mapping = singleMappings[idWithoutExt];
        if (mapping) {
            item.title = mapping.title;
            // Merge isHealthCommunication logic
            if (mapping.isHealthCommunication !== undefined) {
                item.isHealthCommunication = mapping.isHealthCommunication;
            }
        }
        item.type = "single";
        // if item type from before was video or document, we need to preserve that for rendering.
        // Let's create an item array of size 1 so we can handle it uniformly as a gallery of 1, or just keep it flat.
        // Keeping it flat is easier, but for the React component, having everything as a 'project' with an `items` array is very clean.
        finalData.push({
            title: item.title,
            description: "",
            category: item.category,
            isHealthCommunication: item.isHealthCommunication,
            type: "single",
            items: [item]
        });
    }
});

fs.writeFileSync('C:\\Users\\juanj\\.gemini\\antigravity\\scratch\\portfolio\\src\\data\\portfolio_grouped.json', JSON.stringify(finalData, null, 2));
console.log('Grouped data created successfully');

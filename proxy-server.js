// Simple Node.js proxy server for Notion API
// This solves CORS issues by making requests server-side
// 
// Install dependencies: npm install express cors
// Run: node proxy-server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Load config
const fs = require('fs');
let NOTION_CONFIG = {};
try {
    const configFile = fs.readFileSync('./notion-config.js', 'utf8');
    // Extract API token from config file (simple parsing)
    const tokenMatch = configFile.match(/API_TOKEN:\s*['"]([^'"]+)['"]/);
    const pageIdMatch = configFile.match(/PAGE_ID:\s*['"]([^'"]+)['"]/);
    
    if (tokenMatch && pageIdMatch) {
        NOTION_CONFIG = {
            API_TOKEN: tokenMatch[1],
            PAGE_ID: pageIdMatch[1]
        };
    }
} catch (error) {
    console.error('Error reading notion-config.js:', error.message);
    console.log('Make sure notion-config.js exists and contains your API token');
}

app.use(cors());
app.use(express.json());

// Proxy endpoint voor Notion API
app.get('/api/notion/changelog', async (req, res) => {
    if (!NOTION_CONFIG.API_TOKEN || NOTION_CONFIG.API_TOKEN === 'YOUR_NOTION_API_TOKEN_HERE') {
        return res.status(500).json({ error: 'Notion API not configured. Please set your API token in notion-config.js' });
    }

    try {
        const pageId = NOTION_CONFIG.PAGE_ID;
        
        // Haal blocks op van de Notion pagina
        const blocksUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
        const blocksResponse = await fetch(blocksUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_CONFIG.API_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        if (!blocksResponse.ok) {
            throw new Error(`Notion API error: ${blocksResponse.status}`);
        }

        const blocksData = await blocksResponse.json();
        const blocks = blocksData.results || [];

        // Parse blocks naar changelog items
        const changelogItems = [];
        
        blocks.forEach(block => {
            if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
                const text = extractTextFromBlock(block);
                if (text) {
                    const versionMatch = text.match(/(?:v|version\s*)?(\d+\.\d+\.\d+|\d+\.\d+)\s*[-–]?\s*(.+)/i);
                    if (versionMatch) {
                        changelogItems.push({
                            version: versionMatch[1],
                            description: versionMatch[2] || text
                        });
                    } else {
                        changelogItems.push({ version: null, description: text });
                    }
                }
            } else if (block.type === 'paragraph') {
                const text = extractTextFromBlock(block);
                if (text) {
                    const versionMatch = text.match(/(?:v|version\s*)?(\d+\.\d+\.\d+|\d+\.\d+)\s*[-–]?\s*(.+)/i);
                    if (versionMatch) {
                        changelogItems.push({
                            version: versionMatch[1],
                            description: versionMatch[2] || text
                        });
                    }
                }
            }
        });

        res.json({ changelog: changelogItems });
    } catch (error) {
        console.error('Error fetching from Notion API:', error);
        res.status(500).json({ error: error.message });
    }
});

function extractTextFromBlock(block) {
    if (!block) return '';
    const richText = block[block.type]?.rich_text || [];
    if (richText.length === 0) return '';
    return richText.map(rt => rt.plain_text || '').join('');
}

app.listen(PORT, () => {
    console.log(`Notion API proxy server running on http://localhost:${PORT}`);
    console.log(`Changelog endpoint: http://localhost:${PORT}/api/notion/changelog`);
});


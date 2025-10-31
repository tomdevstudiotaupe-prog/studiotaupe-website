// Serverless API endpoint voor Vercel/Netlify
// Dit bestand kan worden gehost op Vercel of Netlify als serverless functie

// Laad config uit environment variables (VEEL veiliger dan in code!)
const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN || '';
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID || '280fbc1018e3800bbb0bfa0bfacc6d6a';

export default async function handler(req, res) {
    // CORS headers toestaan
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!NOTION_API_TOKEN) {
        return res.status(500).json({ error: 'Notion API token not configured' });
    }

    try {
        // Haal blocks op van de Notion pagina
        const blocksUrl = `https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children`;
        const blocksResponse = await fetch(blocksUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_API_TOKEN}`,
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

        return res.status(200).json({ changelog: changelogItems });
    } catch (error) {
        console.error('Error fetching from Notion API:', error);
        return res.status(500).json({ error: error.message });
    }
}

function extractTextFromBlock(block) {
    if (!block) return '';
    const richText = block[block.type]?.rich_text || [];
    if (richText.length === 0) return '';
    return richText.map(rt => rt.plain_text || '').join('');
}


// Netlify serverless function
exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json'
    };

    // Laad config uit environment variables
    const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
    const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID || '280fbc1018e3800bbb0bfa0bfacc6d6a';

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    if (!NOTION_API_TOKEN) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Notion API token not configured' })
        };
    }

    try {
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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ changelog: changelogItems })
        };
    } catch (error) {
        console.error('Error fetching from Notion API:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

function extractTextFromBlock(block) {
    if (!block) return '';
    const richText = block[block.type]?.rich_text || [];
    if (richText.length === 0) return '';
    return richText.map(rt => rt.plain_text || '').join('');
}


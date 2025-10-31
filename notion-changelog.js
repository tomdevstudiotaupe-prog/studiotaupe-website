// Notion API Changelog Loader
// This script fetches the changelog from Notion via a proxy server
// For production, use the proxy-server.js or a backend endpoint

async function loadChangelogFromNotion() {
    const changelogList = document.getElementById('changelog-list');
    if (!changelogList) return;

    try {
        // Option 1: Via serverless API (recommended for production)
        // Option 2: Via local proxy server (for development)
        // Option 3: Direct API call (may have CORS issues)
        
        // Kies welke je wilt gebruiken:
        // - Voor productie (Vercel/Netlify): gebruik serverlessUrl
        // - Voor lokale ontwikkeling: gebruik proxyUrl (met npm run proxy)
        // - Voor direct testen: zet useProxy op false
        
        const useServerless = true; // Enabled for Vercel/Netlify deployment
        const useProxy = false; // Zet op true voor lokale proxy server
        const serverlessUrl = '/api/changelog'; // Voor Vercel/Netlify
        const proxyUrl = 'http://localhost:3000/api/notion/changelog'; // Voor lokale proxy
        
        let changelogItems = [];
        
        if (useServerless) {
            // Via serverless API (Vercel/Netlify)
            const response = await fetch(serverlessUrl);
            if (!response.ok) {
                throw new Error(`Serverless API error: ${response.status}`);
            }
            const data = await response.json();
            changelogItems = data.changelog || [];
        } else if (useProxy) {
            // Via proxy server
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`Proxy server error: ${response.status}. Make sure proxy-server.js is running.`);
            }
            const data = await response.json();
            changelogItems = data.changelog || [];
        } else {
            // Direct API call (may have CORS issues in browser)
            if (!NOTION_CONFIG || !NOTION_CONFIG.API_TOKEN || NOTION_CONFIG.API_TOKEN === 'YOUR_NOTION_API_TOKEN_HERE') {
                changelogList.innerHTML = '<li style="margin-bottom:8px; color:#8d7a6a;"><em>Notion API not configured. Please set your API token in notion-config.js or use the proxy server.</em></li>';
                return;
            }

            const pageId = NOTION_CONFIG.PAGE_ID;
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

            blocks.forEach(block => {
                if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
                    const text = extractTextFromBlock(block);
                    if (text) {
                        const versionMatch = text.match(/(?:v|version\s*)?(\d+\.\d+\.\d+|\d+\.\d+)\s*[-–]?\s*(.+)/i);
                        if (versionMatch) {
                            changelogItems.push({ version: versionMatch[1], description: versionMatch[2] || text });
                        } else {
                            changelogItems.push({ version: null, description: text });
                        }
                    }
                } else if (block.type === 'paragraph') {
                    const text = extractTextFromBlock(block);
                    if (text) {
                        const versionMatch = text.match(/(?:v|version\s*)?(\d+\.\d+\.\d+|\d+\.\d+)\s*[-–]?\s*(.+)/i);
                        if (versionMatch) {
                            changelogItems.push({ version: versionMatch[1], description: versionMatch[2] || text });
                        }
                    }
                }
            });
        }

        // Render changelog items
        if (changelogItems.length === 0) {
            changelogList.innerHTML = '<li style="margin-bottom:8px; color:#8d7a6a;"><em>No changelog items found in Notion page</em></li>';
        } else {
            changelogList.innerHTML = changelogItems.map(item => {
                if (item.version) {
                    return `<li style="margin-bottom:8px;"><strong style="color:#0F5132;">${item.version}</strong> – ${escapeHtml(item.description)}</li>`;
                } else {
                    return `<li style="margin-bottom:8px;">${escapeHtml(item.description)}</li>`;
                }
            }).join('');
        }

    } catch (error) {
        console.error('Error loading changelog from Notion:', error);
        let errorMsg = error.message;
        
        // Check for CORS error
        if (error.message.includes('fetch') || error.message.includes('CORS') || error.name === 'TypeError') {
            errorMsg = 'CORS error: Browser blocked the request. You need to use the proxy server.';
            changelogList.innerHTML = `<li style="margin-bottom:8px; color:#d32f2f;"><em>Error: ${errorMsg}</em><br><br><small style="color:#6a5a4a;"><strong>Oplossing:</strong><br>1. Installeer Node.js van <a href="https://nodejs.org/" target="_blank" style="color:#0F5132;">nodejs.org</a><br>2. Open terminal en voer uit:<br>&nbsp;&nbsp;&nbsp;<code>cd "${window.location.pathname.split('/').slice(0, -1).join('/') || '.'}"</code><br>&nbsp;&nbsp;&nbsp;<code>npm install</code><br>&nbsp;&nbsp;&nbsp;<code>npm run proxy</code><br>3. Zet <code>useProxy = true</code> in notion-changelog.js<br>4. Herlaad de pagina</small></li>`;
        } else {
            changelogList.innerHTML = `<li style="margin-bottom:8px; color:#d32f2f;"><em>Error loading changelog: ${errorMsg}</em><br><small>Check browser console (F12) for details.</small></li>`;
        }
    }
}

// Helper function om tekst uit een Notion block te halen
function extractTextFromBlock(block) {
    if (!block) return '';
    
    const richText = block[block.type]?.rich_text || [];
    if (richText.length === 0) return '';
    
    return richText.map(rt => rt.plain_text || '').join('');
}

// Helper function om HTML te escapen
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Laad changelog wanneer de pagina geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChangelogFromNotion);
} else {
    loadChangelogFromNotion();
}


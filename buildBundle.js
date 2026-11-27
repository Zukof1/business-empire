const fs = require('fs');
const path = require('path');

function base64Encode(file) {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}

console.log('Building bundled HTML...');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace css
const stylesCss = fs.readFileSync('styles.css', 'utf8');
indexHtml = indexHtml.replace('<link rel="stylesheet" href="styles.css">', `<style>${stylesCss}</style>`);

// Replace scripts one by one
['state.js', 'logic.js', 'ui.js', 'threeRender.js'].forEach(scriptName => {
    // Escape script name for regex
    const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedName = escapeRegex(scriptName);
    const regex = new RegExp(`<script src="${escapedName}[^"]*"></script>`);
    
    const scriptContent = fs.readFileSync(scriptName, 'utf8');
    
    let processedScript = scriptContent;
    if (scriptName === 'ui.js') {
        const assetsDir = path.join(__dirname, 'Assets');
        if (fs.existsSync(assetsDir)) {
            const files = fs.readdirSync(assetsDir);
            files.forEach(file => {
                if (file.endsWith('.png')) {
                    const b64 = base64Encode(path.join(assetsDir, file));
                    // we use a simple string replace to inject the base64, avoiding regex special chars
                    const dataUri = `data:image/png;base64,${b64}`;
                    processedScript = processedScript.split(`.\\/Assets\\/${file}`).join(dataUri);
                    processedScript = processedScript.split(`Assets\\/${file}`).join(dataUri);
                    processedScript = processedScript.split(`./Assets/${file}`).join(dataUri);
                    processedScript = processedScript.split(`Assets/${file}`).join(dataUri);
                }
            });
        }
    }

    // Wrap script
    // Note: Instead of passing a string which evaluates regex replacement patterns like $1
    // We pass a function that returns the exact string we want.
    indexHtml = indexHtml.replace(regex, () => `<script>\n${processedScript}\n</script>`);
});

const outDir = path.join(__dirname, 'expo-app', 'assets');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// We just write to an HTML file instead of a JS string export
fs.writeFileSync(path.join(outDir, 'bundle.html'), indexHtml);

console.log('Successfully bundled to bundle.html.');

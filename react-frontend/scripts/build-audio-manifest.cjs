// Build audio manifest from public/assets/audio
// Usage: node scripts/build-audio-manifest.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');

const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);

function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error('[audio-manifest] No audio dir at', AUDIO_DIR);
    process.exit(0);
  }
  const files = fs.readdirSync(AUDIO_DIR)
    .filter((f) => AUDIO_EXTS.has(path.extname(f).toLowerCase()));

  const manifest = files.map((f) => ({
    name: path.basename(f),
    url: `/assets/audio/${f}`,
  }));

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`[audio-manifest] Wrote ${files.length} entries to`, MANIFEST);
}

main();

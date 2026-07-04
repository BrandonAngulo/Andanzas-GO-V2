
const fs = require('fs');
let content = fs.readFileSync('components/views/FullView.tsx', 'utf8');
if (!content.includes('BookOpen')) {
  content = content.replace('Video } from', 'Video, BookOpen, ArrowRight } from');
}
fs.writeFileSync('components/views/FullView.tsx', content);


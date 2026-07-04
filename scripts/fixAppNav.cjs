
const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(
  '{ id: ''noticias'', label: ''nav.news'' }',
  '{ id: ''paquesepas'', label: ''panelTitles.paquesepas'' },\n                { id: ''noticias'', label: ''nav.news'' }'
);
fs.writeFileSync('App.tsx', content);


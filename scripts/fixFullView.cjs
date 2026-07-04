
const fs = require('fs');
let content = fs.readFileSync('components/views/FullView.tsx', 'utf8');

// 1. Fix SiteDetail props
content = content.replace(
  'activeRoute?: Ruta | null, visitedPoints?: string[], onVisitPoint?: () => void }>',
  'activeRoute?: Ruta | null, visitedPoints?: string[], onVisitPoint?: () => void, onClose?: () => void, onNavigateToAprende?: () => void }>'
);

// 2. Fix SiteDetail destructuring
content = content.replace(
  'visitedPoints, onVisitPoint }) => {',
  'visitedPoints, onVisitPoint, onClose, onNavigateToAprende }) => {'
);

// 3. Fix SiteDetail usage
content = content.replace(
  'visitedPoints={visitedPoints} onVisitPoint={onVisitPoint} />',
  'visitedPoints={visitedPoints} onVisitPoint={onVisitPoint} onClose={onClose} onNavigateToAprende={onNavigateToAprende} />'
);

fs.writeFileSync('components/views/FullView.tsx', content);


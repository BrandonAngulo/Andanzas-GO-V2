const fs = require('fs');
const path = require('path');

const adminDir = path.join('components', 'panels', 'admin');
const filesToFix = fs.readdirSync(adminDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map(f => path.join(adminDir, f));

filesToFix.push(path.join('components', 'views', 'RouteIntroModal.tsx'));

// AdminDashboard encoding fix
const adminDashboardPath = path.join(adminDir, 'AdminDashboard.tsx');
if (fs.existsSync(adminDashboardPath)) {
  let content = fs.readFileSync(adminDashboardPath, 'utf8');
  if (content.includes('Administraci')) {
    content = content.replace(/Administraci[^n<]+n/g, 'Administración');
    fs.writeFileSync(adminDashboardPath, content, 'utf8');
    console.log('Fixed encoding in AdminDashboard.tsx');
  }
}

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace alert with toast.error
  if (content.includes('alert(')) {
    // Basic replace of alert(something) to toast.error(something)
    content = content.replace(/alert\((.*)\)/g, 'toast.error($1)');
    changed = true;
    
    // Ensure toast is imported
    if (!content.includes('import { toast }') && !content.includes('import {toast}')) {
      content = 'import { toast } from "sonner";\n' + content;
    }
  }

  // Special fix for the avatar creation error message formatting
  if (file.includes('AdminAvatarsManager.tsx')) {
    content = content.replace(/Verifica que el ID sea [^\.]+./g, 'Verifica que el ID sea único.');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed alerts in', file);
  }
});

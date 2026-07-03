import fs from 'fs';
import { CULTURAL_ROUTES } from '../data/routes';
import routesData from '../routes_data.json';

const getRoute = (id) => CULTURAL_ROUTES.find(r => r.id === id);
const getOldRoute = (id) => routesData.find(r => r.id === id);

// We want 6 routes in total. We map the new ones to the old IDs so we don't break existing references if any,
// OR we just keep the new IDs and update everything. 
// Since users might have saved progress on `ruta1`, it's better to keep the ID `ruta1` but overwrite the content with `route-salsa`.
// Actually, `route-salsa` uses ID `route-salsa`. To keep things clean in Supabase and the codebase, let's use the new IDs for the 4 new routes, and keep `ruta2` and `ruta4` IDs. Wait, if we delete the old `ruta1`, `ruta3`, `ruta5`, `ruta6` we might break foreign keys in `user_badges` or `routes_progress`? 
// The audit said: "Unificar datos: decidir cuál es la fuente oficial". Let's standardize IDs. Let's keep `ruta1` to `ruta6` as IDs for simplicity!

const newRoutes = [
    { ...getRoute('route-salsa'), id: 'ruta1' },
    getOldRoute('ruta2'),
    { ...getRoute('route-art'), id: 'ruta3' },
    getOldRoute('ruta4'),
    { ...getRoute('route-lit'), id: 'ruta5' },
    { ...getRoute('route-food'), id: 'ruta6' }
];

fs.writeFileSync('routes_unified.json', JSON.stringify(newRoutes, null, 2));
console.log('Successfully created routes_unified.json with 6 routes.');

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const corrections = [
    { id: 's1', nombre: 'Museo La Tertulia', lat: 3.4503, lng: -76.5453 },
    { id: 's2', nombre: 'Teatro Municipal Enrique Buenaventura', lat: 3.4494, lng: -76.5359 },
    { id: 's3', nombre: 'Bulevar del Río', lat: 3.4527, lng: -76.5348 },
    { id: 's4', nombre: 'Lugar a Dudas', lat: 3.4591, lng: -76.5339 },
    { id: 's5', nombre: 'Monumento a Sebastián de Belalcázar', lat: 3.4492, lng: -76.5452 },
    { id: 's6', nombre: 'Centro Cultural de Cali', lat: 3.4498, lng: -76.5362 },
    { id: 's7', nombre: 'La Topa Tolondra', lat: 3.4443, lng: -76.5365 },
    { id: 's8', nombre: 'Parque del Gato de Tejada', lat: 3.4514, lng: -76.5430 },
    { id: 's9', nombre: 'Plaza de Mercado Alameda', lat: 3.4347, lng: -76.5357 },
    { id: 's10', nombre: 'Museo del Oro Calima', lat: 3.4516, lng: -76.5320 },
    { id: 's11', nombre: 'Loma de la Cruz (Parque Artesanal)', lat: 3.4402, lng: -76.5404 },
    { id: 's12', nombre: 'Museo Arqueológico La Merced', lat: 3.4506, lng: -76.5366 },
    { id: 's13', nombre: 'Zoológico de Cali', lat: 3.4481, lng: -76.5568 },
    { id: 's14', nombre: 'Teatro La Máscara', lat: 3.4462, lng: -76.5385 },
    { id: 's15', nombre: 'Biblioteca Departamental Jorge Garcés Borrero', lat: 3.4363, lng: -76.5393 },
    { id: 's16', nombre: 'Iglesia La Ermita', lat: 3.4540, lng: -76.5320 },
    { id: 's17', nombre: 'Monumento a Cristo Rey', lat: 3.4360, lng: -76.5648 },
    { id: 's18', nombre: 'Jardín Botánico de Cali', lat: 3.4498, lng: -76.5707 },
    { id: 's19', nombre: 'Parque San Antonio', lat: 3.4475, lng: -76.5418 },
    { id: 's20', nombre: 'Ecoparque Río Pance (Entrada Principal)', lat: 3.3280, lng: -76.6320 },
    { id: 's21', nombre: 'Plazoleta Jairo Varela', lat: 3.4550, lng: -76.5348 },
    { id: 's22', nombre: 'Teatro Jorge Isaacs', lat: 3.4534, lng: -76.5321 },
    { id: 's23', nombre: 'Casa Obeso Mejía', lat: 3.4515, lng: -76.5453 },
    { id: 's24', nombre: 'Parque del Perro', lat: 3.4358, lng: -76.5435 },
    { id: 's25', nombre: 'Museo de la Salsa', lat: 3.4484, lng: -76.5186 },
    { id: 's26', nombre: 'Parque Panamericano (Las Banderas)', lat: 3.4317, lng: -76.5424 },
    { id: 's27', nombre: 'Escuela de Baile Swing Latino', lat: 3.4291, lng: -76.5379 },
    { id: 's28', nombre: 'Zaperoco Bar', lat: 3.4591, lng: -76.5313 },
    { id: 's29', nombre: 'Tin Tin Deo', lat: 3.4304, lng: -76.5434 },
    { id: 's30', nombre: 'Museo de Ciencias Naturales (Federico Carlos Lehmann)', lat: 3.4363, lng: -76.5390 },
    { id: 's31', nombre: 'Restaurante Ringlete', lat: 3.4599, lng: -76.5342 },
    { id: 's32', nombre: 'Instituto Departamental de Bellas Artes', lat: 3.4529, lng: -76.5363 },
    { id: 's33', nombre: 'Tecnocentro Cultural Somos Pacífico', lat: 3.4100, lng: -76.4710 },
    { id: 's34', nombre: 'Museo Caliwood', lat: 3.4505, lng: -76.5472 },
    { id: 's35', nombre: 'Hacienda Cañasgordas', lat: 3.3575, lng: -76.5245 },
    { id: 's36', nombre: 'Hacienda El Paraíso', lat: 3.6409, lng: -76.1969 },
    { id: 's37', nombre: 'Barrio El Peñón (Parque)', lat: 3.4491, lng: -76.5436 },
    { id: 's38', nombre: 'Ecoparque Lago de las Garzas', lat: 3.3319, lng: -76.5369 },
    { id: 's39', nombre: 'Plaza de Cayzedo', lat: 3.4518, lng: -76.5329 },
    { id: 's40', nombre: 'Torre de Cali', lat: 3.4578, lng: -76.5298 },
    { id: 's41', nombre: 'Teatro Calima', lat: 3.4563, lng: -76.5337 },
    { id: 's42', nombre: 'Teatro Esquina Latina', lat: 3.4363, lng: -76.5469 },
    { id: 's43', nombre: 'La Linterna', lat: 3.4478, lng: -76.5394 },
    { id: 's44', nombre: 'Tienda Teatral', lat: 3.4452, lng: -76.5370 },
    { id: 's45', nombre: 'Cinemateca La Tertulia', lat: 3.4503, lng: -76.5453 },
    { id: 's46', nombre: 'Teatro El Mulato Cabaret', lat: 3.4284, lng: -76.5381 },
    { id: 's47', nombre: 'Parque de la Música', lat: 3.4731, lng: -76.5259 },
    { id: 's48', nombre: 'Parque del Ingenio', lat: 3.3831, lng: -76.5323 },
    { id: 's49', nombre: 'Kilómetro 18', lat: 3.4890, lng: -76.6210 },
    { id: 's50', nombre: 'Museo Aéreo Fénix', lat: 3.5180, lng: -76.3880 },
    { id: 's52', nombre: 'Monumento a Jovita Feijóo', lat: 3.4406, lng: -76.5368 },
    { id: 's53', nombre: 'Biblioteca del Centenario', lat: 3.4507, lng: -76.5437 },
    { id: 's54', nombre: 'Centro Cultural Colombo Americano', lat: 3.4561, lng: -76.5322 },
    { id: 's55', nombre: 'Alianza Francesa de Cali', lat: 3.4633, lng: -76.5302 },
    { id: 's56', nombre: 'Unidad Recreativa Parque del Avión', lat: 3.4692, lng: -76.5179 },
    { id: 's57', nombre: 'Plazoleta de San Francisco', lat: 3.4497, lng: -76.5336 },
    { id: 's58', nombre: 'Parque de los Poetas', lat: 3.4533, lng: -76.5328 },
    { id: 's59', nombre: 'Puente Ortiz', lat: 3.4534, lng: -76.5331 },
    { id: 's60', nombre: 'Parque del Peñón', lat: 3.4491, lng: -76.5436 },
    { id: 's61', nombre: 'Barrio Granada', lat: 3.4580, lng: -76.5330 },
    { id: 's62', nombre: 'Ciudad Jardín', lat: 3.3510, lng: -76.5290 },
    { id: 's63', nombre: 'Capilla de San Antonio', lat: 3.4476, lng: -76.5418 },
    { id: 's64', nombre: 'Catedral de San Pedro Apóstol', lat: 3.4513, lng: -76.5326 },
    { id: 's65', nombre: 'Cerro de las Tres Cruces', lat: 3.4650, lng: -76.5480 },
    { id: 's66', nombre: 'Teatro Salamandra', lat: 3.4324, lng: -76.5459 },
    { id: 's67', nombre: 'Casa de los Títeres', lat: 3.4446, lng: -76.5410 },
    { id: 's68', nombre: 'Domus Teatro', lat: 3.4385, lng: -76.5410 },
    { id: 's69', nombre: 'Fundación Escénica Cali Teatro', lat: 3.4456, lng: -76.5373 },
    { id: 's70', nombre: 'Teatro del Presagio', lat: 3.4542, lng: -76.5312 },
    { id: 's71', nombre: 'MalaMaña Salsa Bar', lat: 3.4473, lng: -76.5329 },
    { id: 's72', nombre: 'Punto Baré', lat: 3.4447, lng: -76.5383 },
    { id: 's73', nombre: 'La Caldera del Diablo', lat: 3.4433, lng: -76.5365 },
    { id: 's74', nombre: 'Museo de la Caña', lat: 3.6050, lng: -76.2480 },
    { id: 's75', nombre: 'Museo MULI (Antigua Estación Tren)', lat: 3.4663, lng: -76.5230 },
    { id: 's76', nombre: 'Monumento a la Solidaridad', lat: 3.4713, lng: -76.5214 },
    { id: 's77', nombre: 'Biblioteca Púb. Centro Cultural Nuevo Latir', lat: 3.4189, lng: -76.4866 },
    { id: 's78', nombre: 'Centro de Emprendimiento Cultural Comuna 13', lat: 3.4282, lng: -76.4975 },
    { id: 's79', nombre: 'Central Didáctica La Casona', lat: 3.4176, lng: -76.4776 },
    { id: 's80', nombre: 'Centro Cultural Abriendo Puertas', lat: 3.4063, lng: -76.4982 },
    { id: 's81', nombre: 'Biblioteca Pública Municipal San Marino', lat: 3.4611, lng: -76.4881 },
    { id: 's82', nombre: 'Biblioteca Pública Daniel Guillard', lat: 3.4262, lng: -76.4864 },
    { id: 's83', nombre: 'Biblioteca Pública Los Naranjos', lat: 3.4230, lng: -76.4760 },
    { id: 's84', nombre: 'Academia de Baile Star Latin', lat: 3.4201, lng: -76.4894 },
    { id: 's85', nombre: 'Fundación Sabor y Swing', lat: 3.4290, lng: -76.5300 },
    { id: 's86', nombre: 'Bulevar de Oriente', lat: 3.4240, lng: -76.4850 },
    { id: 's87', nombre: 'Unidad Deportiva Alberto Galindo', lat: 3.4150, lng: -76.5510 },
    { id: 's88', nombre: 'Arena Cañaveralejo (Plaza de Toros)', lat: 3.4128, lng: -76.5515 },
    { id: 's89', nombre: 'Biblioteca Pública Isaías Duarte Cancino', lat: 3.4155, lng: -76.4760 },
    { id: 's90', nombre: 'Biblioteca Pública Rigoberta Menchú', lat: 3.4270, lng: -76.4980 },
    { id: 's91', nombre: 'Biblioteca Pública Municipal Desepaz', lat: 3.4355, lng: -76.4660 },
    { id: 's92', nombre: 'Biblioestación Andrés Sanín', lat: 3.4460, lng: -76.4820 },
    { id: 's93', nombre: 'Escuela de Baile King of the Swing', lat: 3.4168, lng: -76.4772 },
    { id: 's94', nombre: 'Academia de Baile Imperio Juvenil', lat: 3.4250, lng: -76.4960 },
    { id: 's95', nombre: 'Centro Cultural U.R El Vallado', lat: 3.4070, lng: -76.4900 },
    { id: 's96', nombre: 'TEC - Teatro Experimental de Cali', lat: 3.4477, lng: -76.5349 },
];

async function updatePreciseLocations() {
    console.log(`Starting massive precision update for ${corrections.length} sites...`);
    let success = 0;

    for (const site of corrections) {
        const { error } = await supabase
            .from('sites')
            .update({
                lat: site.lat,
                lng: site.lng,
                // Optionally update name if corrected, though strict match is on ID
                nombre: site.nombre
            })
            .eq('id', site.id);

        if (error) {
            console.error(`Error updating ${site.id} (${site.nombre}):`, error.message);
        } else {
            console.log(`Updated ${site.id}: ${site.nombre} -> [${site.lat}, ${site.lng}]`);
            success++;
        }
    }

    console.log(`\nMassive update complete. ${success} sites updated successfully.`);
}

updatePreciseLocations();

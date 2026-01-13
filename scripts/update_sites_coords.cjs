const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
    { id: 's1', lat: 3.45008, lng: -76.54533 }, // Museo La Tertulia
    { id: 's2', lat: 3.449275, lng: -76.535861 }, // Teatro Municipal
    { id: 's3', lat: 3.4533, lng: -76.5333 }, // Bulevar del Río
    { id: 's4', lat: 3.4578, lng: -76.5398 }, // Lugar a Dudas
    { id: 's5', lat: 3.44859, lng: -76.55855 }, // Zoológico
    { id: 's6', lat: 3.4500, lng: -76.5357 }, // Museo Oro Calima
    { id: 's7', lat: 3.4429, lng: -76.5398 }, // La Topa Tolondra
    { id: 's8', lat: 3.4516, lng: -76.5413 }, // Gato de Tejada
    { id: 's9', lat: 3.4397, lng: -76.5347 }, // Plaza Mercado Alameda
    { id: 's10', lat: 3.4492, lng: -76.5453 }, // Sebastián de Belalcázar
    { id: 's11', lat: 3.4435, lng: -76.5385 }, // Loma de la Cruz
    { id: 's12', lat: 3.4505, lng: -76.5367 }, // Museo Arqueológico La Merced
    { id: 's13', lat: 3.4540, lng: -76.5323 }, // Iglesia La Ermita
    { id: 's14', lat: 3.4439, lng: -76.5401 }, // Teatro La Máscara
    { id: 's15', lat: 3.4364, lng: -76.5394 }, // Biblioteca Departamental
    { id: 's16', lat: 3.4489, lng: -76.5355 }, // Centro Cultural de Cali
    { id: 's17', lat: 3.436394, lng: -76.565117 }, // Cristo Rey
    { id: 's18', lat: 3.4512, lng: -76.5583 }, // Jardín Botánico
    { id: 's19', lat: 3.4461, lng: -76.5414 }, // Parque San Antonio
    { id: 's20', lat: 3.3283, lng: -76.6311 }, // Ecoparque Río Pance
    { id: 's21', lat: 3.4561, lng: -76.5317 }, // Plazoleta Jairo Varela
    { id: 's22', lat: 3.4534, lng: -76.5321 }, // Teatro Jorge Isaacs
    { id: 's23', lat: 3.4561, lng: -76.5451 }, // Casa Obeso Mejía
    { id: 's24', lat: 3.4449, lng: -76.5276 }, // Museo de la Salsa
    { id: 's25', lat: 3.4356, lng: -76.5439 }, // Parque del Perro
    { id: 's26', lat: 3.4319, lng: -76.5424 }, // Parque Panamericano
    { id: 's27', lat: 3.4350, lng: -76.5400 }, // Swing Latino
    { id: 's28', lat: 3.4565, lng: -76.5298 }, // Zaperoco Bar
    { id: 's29', lat: 3.4300, lng: -76.5450 }, // Tin Tin Deo
    { id: 's30', lat: 3.4362, lng: -76.5390 }, // Museo Ciencias Naturales
    { id: 's31', lat: 3.4506, lng: -76.5474 }, // Museo Caliwood
    { id: 's32', lat: 3.4542, lng: -76.5311 }, // Bellas Artes
    { id: 's33', lat: 3.4601, lng: -76.5295 }, // Restaurante Ringlete
    { id: 's34', lat: 3.6358, lng: -76.3264 }, // Museo de la Caña
    { id: 's35', lat: 3.353889, lng: -76.522778 }, // Hacienda Cañasgordas
    { id: 's36', lat: 3.5833, lng: -76.2833 }, // Hacienda El Paraíso
    { id: 's37', lat: 3.4485, lng: -76.5435 }, // El Peñón Zona Gastro
    { id: 's38', lat: 3.3444, lng: -76.5298 }, // Ecoparque Garzas
    { id: 's39', lat: 3.4519, lng: -76.5325 }, // Plaza de Cayzedo
    { id: 's40', lat: 3.4589, lng: -76.5275 }, // Torre de Cali
    { id: 's41', lat: 3.4583, lng: -76.5331 }, // Teatro Calima
    { id: 's42', lat: 3.4363, lng: -76.5469 }, // Teatro Esquina Latina
    { id: 's43', lat: 3.4478, lng: -76.5393 }, // La Linterna
    { id: 's44', lat: 3.4450, lng: -76.5410 }, // Tienda Teatral (Approx)
    { id: 's45', lat: 3.4501, lng: -76.5453 }, // Cinemateca La Tertulia
    { id: 's46', lat: 3.4311, lng: -76.5389 }, // Mulato Cabaret
    { id: 's47', lat: 3.4730, lng: -76.5260 }, // Parque de la Música
    { id: 's48', lat: 3.4360, lng: -76.5292 }, // Teatro Salamandra
    { id: 's49', lat: 3.4908, lng: -76.6219 }, // Kilómetro 18
    { id: 's50', lat: 3.5539, lng: -76.3859 }, // Museo Aéreo Fénix
    { id: 's52', lat: 3.4405, lng: -76.5370 }, // Monumento a Jovita
    { id: 's53', lat: 3.4497, lng: -76.5431 }, // Biblioteca Centenario
    { id: 's54', lat: 3.4580, lng: -76.5300 }, // Centro Cultural Colombo Americano
    { id: 's55', lat: 3.4650, lng: -76.5260 }, // Alianza Francesa
    { id: 's56', lat: 3.4697, lng: -76.5172 }, // Parque del Avión
    { id: 's57', lat: 3.4494, lng: -76.5333 }, // Plazoleta San Francisco
    { id: 's58', lat: 3.4533, lng: -76.5320 }, // Parque de los Poetas
    { id: 's59', lat: 3.4535, lng: -76.5335 }, // Puente Ortiz
    { id: 's60', lat: 3.4468, lng: -76.5401 }, // Parque del Peñón
    { id: 's61', lat: 3.4580, lng: -76.5300 }, // Barrio Granada
    { id: 's62', lat: 3.3600, lng: -76.5300 }, // Ciudad Jardín
    { id: 's63', lat: 3.4476, lng: -76.5420 }, // Capilla San Antonio
    { id: 's64', lat: 3.4510, lng: -76.5320 }, // Catedral San Pedro
    { id: 's65', lat: 3.4673, lng: -76.5469 }, // Cerro Tres Cruces
    { id: 's66', lat: 3.4477, lng: -76.5349 }, // TEC
    { id: 's67', lat: 3.4455, lng: -76.5408 }, // Casa de los Títeres
    { id: 's68', lat: 3.4357, lng: -76.5262 }, // Domus Teatro
    { id: 's69', lat: 3.4507, lng: -76.5383 }, // Cali Teatro
    { id: 's70', lat: 3.4586, lng: -76.5292 }, // Teatro del Presagio
    { id: 's71', lat: 3.4512, lng: -76.5342 }, // MalaMaña Salsa Bar
    { id: 's72', lat: 3.4440, lng: -76.5380 }, // Punto Baré
    { id: 's73', lat: 3.4460, lng: -76.5400 }, // La Caldera del Diablo
    { id: 's75', lat: 3.4682, lng: -76.5398 }, // MULI
    { id: 's76', lat: 3.4720, lng: -76.5250 }, // Monumento Solidaridad
    { id: 's77', lat: 3.4072, lng: -76.4789 }, // Biblioteca Nuevo Latir
    { id: 's78', lat: 3.4100, lng: -76.4800 }, // Centro Emprendimiento c13
    { id: 's80', lat: 3.4000, lng: -76.4700 }, // Centro Cultural Abriendo Puertas
    { id: 's81', lat: 3.4700, lng: -76.4800 }, // Biblioteca San Marino
    { id: 's84', lat: 3.4200, lng: -76.4800 }, // Star Latin
    { id: 's86', lat: 3.4100, lng: -76.4700 }, // Bulevar de Oriente
    { id: 's87', lat: 3.4143, lng: -76.5516 }, // Unidad Deportiva Alberto Galindo
    { id: 's88', lat: 3.4106, lng: -76.5487 }, // Arena Cañaveralejo
];

async function updateLocations() {
    console.log(`Starting update for ${updates.length} sites...`);

    let success = 0;
    let failed = 0;

    for (const update of updates) {
        const { error } = await supabase
            .from('sites')
            .update({ lat: update.lat, lng: update.lng })
            .eq('id', update.id);

        if (error) {
            console.error(`Error updating site ${update.id}:`, error);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`Update complete. Success: ${success}, Failed: ${failed}`);
}

updateLocations();

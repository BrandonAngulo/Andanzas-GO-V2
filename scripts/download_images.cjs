const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  's8': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Gato_de_Tejada.jpg',
  's5': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Monumento_a_Sebasti%C3%A1n_de_Belalc%C3%A1zar%2C_Cali.jpg',
  's11': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Parque_Artesanal_Loma_de_la_Cruz.jpg',
  's65': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Cerro_de_las_Tres_Cruces_Cali.jpg',
  's3': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Bulevar_del_Rio_Cali.jpg',
  's122': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Biblioteca_Mario_Carvajal_Univalle.jpg',
  's137': 'https://upload.wikimedia.org/wikipedia/commons/d/df/Estadio_Olimpico_Pascual_Guerrero.jpg',
  's21': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Plazoleta_Jairo_Varela%2C_Cali.jpg',
  's39': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Plaza_de_Cayzedo.jpg',
  's40': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Torre_de_Cali_2.jpg',
  's140': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Complejo_Religioso_San_Francisco.jpg',
  's52': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Monumento_a_Jovita_Feijoo.jpg',
  's108': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Edificio_Otero.jpg'
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  for (const [id, url] of Object.entries(images)) {
    const filename = url.split('/').pop();
    const dest = path.join(__dirname, '../public/images', filename);
    try {
      await download(url, dest);
      console.log('Downloaded', id, filename);
    } catch (e) {
      console.error('Failed', id, e);
    }
  }
}
run();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://jacspnfiscrhxvorovri.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphY3NwbmZpc2NyaHh2b3JvdnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDcxNjEsImV4cCI6MjA5ODM4MzE2MX0.CKyvjcNNnSmRQHxkBaXcOUybTrxaQbjIWOdBSKmIRaQ'
);

const es = {
    mission: "Conectar a las personas —habitantes y visitantes de Cali— con el alma cultural de la ciudad, democratizando el acceso al arte, la historia y las expresiones comunitarias. Buscamos hacer visible lo invisible, acercando a todos al patrimonio vivo que hace de Cali un territorio tan diverso como poderoso.",
    what_is: "Andanzas GO es una Plataforma Web Progresiva (PWA) que funciona como un mapa vivo de la cultura caleña. A través de una interfaz intuitiva y accesible, permite descubrir sitios culturales, recorrer territorios simbólicos, escuchar relatos comunitarios y explorar memorias escondidas entre calles, murales, bibliotecas, teatros, casas culturales y mucho más.",
    who_is: "Andanzas GO es una creación original de Andanzas Centro Cultural, un colectivo artístico y pedagógico con sede en Cali que impulsa procesos de transformación social desde el arte, la cultura y la educación comunitaria."
};

async function run() {
    console.log("Restoring mission...");
    await supabase.from('institutional_content').update({ content_text: es.mission }).eq('section_key', 'mission');
    
    console.log("Restoring what_is...");
    await supabase.from('institutional_content').update({ content_text: es.what_is }).eq('section_key', 'what_is');
    
    console.log("Restoring who_is...");
    await supabase.from('institutional_content').update({ content_text: es.who_is }).eq('section_key', 'who_is');
    
    console.log("Done!");
}

run();

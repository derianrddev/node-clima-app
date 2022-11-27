require('dotenv').config();
const colors = require('colors');
const { menu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
  const busquedas = new Busquedas();
  let opt = '';

  do {
    opt = await menu();

    switch (opt) {
      case '1':
        const lugar = await leerInput('Ciudad: ');

        const lugares = await busquedas.ciudades( lugar );

        const id = await listarLugares( lugares );
        if ( id !== '0') {
          const lugarSeleccionado = lugares.find( lugar => lugar.id === id );

          busquedas.agregarHistorial( lugarSeleccionado.nombre );

          const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );

          console.clear();
          console.log('\nInformación de la ciudad\n'.green);
          console.log('Ciudad:', lugarSeleccionado.nombre.green);
          console.log('Lat:', lugarSeleccionado.lat);
          console.log('Lng:', lugarSeleccionado.lng);
          console.log('Temperatura:', clima.temp);
          console.log('Mínima:', clima.min);
          console.log('Máxima:', clima.max);
          console.log('Como está el clima:', clima.desc.green);
        }
        break;
    
      case '2':
        console.log('');
        busquedas.historialCapitalizado.forEach( ( lugar, indice ) => {
          console.log(`${ colors.blue( indice + 1 ) }${ '.'.blue } ${ lugar }`);
        });
        break;
    }

    if ( opt !== '0' ) await pausa();
  } while ( opt !== '0' );
}

main();
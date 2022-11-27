const axios = require("axios");
const { guardarDB, leerDB } = require("../helpers/db");

class Busquedas {
  historial = [];

  constructor() {
    const historial = leerDB();
    if ( historial ) {
      this.historial = historial;
    }
  }

  get historialCapitalizado() {
    return this.historial.map( lugar => lugar.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) );
  }

  get paramsMapbox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'language': 'es'
    }
  } 

  get paramsOpenWeatherMap() {
    return {
      'appid': process.env.OPENWEATHER_KEY,
      'units': 'metric',
      'lang': 'es'
    }
  }

  async ciudades( lugar = '' ) {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params: this.paramsMapbox,
        headers: { 
          "accept-encoding": null 
        }
      });

      const resp = await instance.get();
      return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async climaLugar( lat, lon ) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { lat, lon, ...this.paramsOpenWeatherMap },
        headers: { 
          "accept-encoding": null 
        }
      });

      const { data } = await instance.get();
      const desc = data.weather[0].description;
      const infoClima = data.main;
      
      return {
        desc,
        min: infoClima.temp_min,
        max: infoClima.temp_max,
        temp: infoClima.temp
      }
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial( lugar = '' ) {
    if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
      this.historial = this.historial.filter(ciudad => ciudad !== lugar.toLocaleLowerCase() );
    }
    this.historial = this.historial.splice( 0, 4 );
    this.historial.unshift( lugar.toLocaleLowerCase() );

    guardarDB( this.historial );
  }
}

module.exports = Busquedas;
const app = Vue.createApp({
  data() {
    return {
      evento: {},
      
    };
  },
  async created() {
    const queryString = location.search;
    const parametros = new URLSearchParams(queryString);
    const id = parametros.get("id");
   
    const ruta = ['https://mindhub-xj03.onrender.com/api/amazing', '../assets/amazing.json'];
    let encontrado = false;
    let i = 0;
    while (!encontrado && i < ruta.length) {
      try {
        const response = await fetch(ruta[i]);
        const data = await response.json();
        encontrado = true;
        this.evento = data.events.find(evento => evento._id == id);
        
      } catch (error) {
        console.log('Error en ruta', ruta[i], error);
        i += 1;
      }
    }
    if (!encontrado) {
      console.log('Error al intertar cargarse los datos');
    }
   
  
  },
});

app.mount('#details');




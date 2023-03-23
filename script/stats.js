const app = Vue.createApp({

  data() {
    return {
     
      datosFuturo:{},
      datosPasado:{},
      eventoMayorAsistencia:[],
      eventoMayorCapacidad:[],
      eventoMenorAsistencia:[],
      mayor:null,
      sortBy: 'categoria', // ordenar por defecto por categoría
      sortDesc: false, // orden ascendente por defecto
      

    };
  },

  async created() {
    const ruta = ['https://mindhub-xj03.onrender.com/api/amazing', '../assets/amazing.json'];
    let encontrado = false;
    let i = 0;
    let data=null
    while (!encontrado && i < ruta.length) {
      
      try {
        const response = await fetch(ruta[i]);
        data = await response.json();
        encontrado = true;
            
      } catch (error) {
        console.log('Error en ruta', ruta[i], error);
        i += 1;
      }
    }
    if (!encontrado) {
      console.log('Error al intertar cargarse los datos');
    }
  

   past = data.events.filter(evento => evento.date < data.currentDate)
   upcoming = data.events.filter(evento => evento.date > data.currentDate)
   this.agregarPorcentajeyGanancia(past,'assistance')
   this.agregarPorcentajeyGanancia(upcoming,'estimate')
   this.datosFuturo = Object.values(this.totalesPorCategoria(upcoming, 'estimate'))
   this.datosPasado = Object.values(this.totalesPorCategoria(past, 'assistance'))
   
   this.eventoMayorCapacidad=this.hallarExtremos(past,'capacity')  
  
   this.eventoMayorAsistencia=this.hallarExtremos(past,'porcentajeAsistencia')
   this.eventoMenorAsistencia=this.hallarExtremos(past,'porcentajeAsistencia',true)
   
   this.mayor = Math.max(this.eventoMenorAsistencia.length, this.eventoMayorAsistencia.length, this.eventoMayorCapacidad.length);  
  
   
   
    //rellenarFila(tablaPast, datosPasado)
  },

  methods: {
    
    agregarPorcentajeyGanancia(array,propiedad) {
      array.forEach(evento => {
        evento.porcentajeAsistencia = (evento[propiedad]/ evento.capacity) 
       
      })

    },

    hallarExtremos (array, propiedad,esMinimo=false)
      {return Object.values(array.reduce((acc, curr,index) => {
      if (esMinimo?curr[propiedad] < acc[0][propiedad]:curr[propiedad] > acc[0][propiedad]) {
        return [curr];
      
      } else if (curr[propiedad] == acc[0][propiedad] && index!=0) {
        acc.push(curr);
      
      }
      return acc;
    }, [array[0]]))},

    totalesPorCategoria(eventos, asistanceOrEstimate) {
      return Object.values(eventos.reduce((totales, event) => {
       let categoria = event.category;
       let capacidad = event.capacity;
       let precio=event.price
       let asistencia = event[asistanceOrEstimate];
       let ganancia = asistencia*precio;
       if (!(categoria in totales)) {
         totales[categoria] = {
           categoria: categoria,
           capacidadTotal: capacidad,
           asistenciaTotal: asistencia,
           totalG: Number(ganancia)
         };
       } else {
         totales[categoria].capacidadTotal += capacidad;
         totales[categoria].asistenciaTotal += asistencia;
         totales[categoria].totalG += Number(ganancia);
       }
       return totales;
     }, {}));
     },

     sortData(orden,datos) {
      let propiedad = this.sortBy;
       if (propiedad=="porcentaje"){
        propiedad=(data) => data.asistenciaTotal / data.capacidadTotal;
      }
      
      datos.sort((a, b) => {
       const valorA = typeof propiedad == "function" ? propiedad(a) : a[propiedad];
       const valorB = typeof propiedad == "function" ? propiedad(b) : b[propiedad];
        if (valorA < valorB) 
       {return -orden}
       else if (valorA > valorB) 
          {return orden}
       else
        {return 0}    
      });
      }
      
  },
    
  }
  
  )

  app.mount('#tablas');

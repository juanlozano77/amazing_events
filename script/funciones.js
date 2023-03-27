const app = Vue.createApp({

  data() {
    return {
      eventos:[],
      categorias:[],
      checkbox:[],
      textoABuscar:"",
      eventosTotales:[],
      encontrado:null,
      isLoading: null,
      jsonEncontrado:null,
      

    };
  },

  async created() {
  
    const ruta = ['https://mindhub-xj03.onrender.com/api/amazing', '../assets/amazing.json'];
    this.isLoading=true
    let jsonEncontrado = false;
    let i = 0;
    let data=null
    while (!jsonEncontrado && i < ruta.length) {
      
      try {
       
        const response = await fetch(ruta[i]);
        data = await response.json();
        jsonEncontrado = true;
        this.isLoading= false
            
      } catch (error) {
        console.log('Error en ruta', ruta[i], error);
        i += 1;
      }
    }
    if (!jsonEncontrado) {
      console.log('Error al intertar cargarse los datos');
      this.isLoading= false
    }
    
    const tituloPagina = document.title.substring(17);
    if (tituloPagina=="Home"){
      this.eventos=data.events
    }
    else if (tituloPagina=="UpComing Events"){
      this.eventos=data.events.filter(evento=> evento.date>data.currentDate)
        }
    else if (tituloPagina=="Past Events"){
       this.eventos=data.events.filter(evento=> evento.date<data.currentDate)
      }
    this.categorias = data.events.map(evento => evento.category ).filter((categoria,index,categorias)=> categorias.indexOf(categoria) == index);
  
    this.eventosTotales=this.eventos
    this.encontrado=true
    
  },
  directives: {resaltar(el, binding){
      
      let selector=['.card-title','.card-text']
      for (contenido of selector){
      
      let tarjeta = el.querySelector(contenido);
      let resaltados = []
      let textoResaltado=""

      texto = binding.value
      const arrayTexto = texto.toLowerCase().split(" ");
  
      arrayTexto.forEach((texto) => {
        textoTarjeta=tarjeta.textContent
        if (texto){
          let indiceParcial = textoTarjeta.toLowerCase().indexOf(texto)
          let indice=indiceParcial
          while (indiceParcial != -1) {
            const textoCoincidente = textoTarjeta.substring(indiceParcial, indiceParcial + texto.length);
            resaltados.push({ indice, textoCoincidente });
            textoTarjeta = textoTarjeta.substring(indiceParcial + texto.length);
            indice+=texto.length
            indiceParcial=textoTarjeta.toLowerCase().indexOf(texto)
            indice+=indiceParcial  
            }
        }
        })

        
      let ultimoIndice = 0
      textoTarjeta=tarjeta.textContent
      resaltados.sort((a, b) => a.indice - b.indice)//ordena los resultados
  
      const resaltadosFiltrados = resaltados.reduce((acc, resaltado, i) => {
        if (i == 0) {
          acc.push(resaltado)
          return acc
        }
        const anterior = resaltados[i - 1].indice + resaltados[i - 1].textoCoincidente.length;
        //elimina las palabras superpuestas totalmente
        if (resaltado.indice + resaltado.textoCoincidente.length <= anterior) {
          resaltado.indice = resaltados[i - 1].indice
          resaltado.textoCoincidente = resaltados[i - 1].textoCoincidente
        } else if (resaltado.indice <= anterior) { //modifica las palabaras superpuestas parcialmente
          let diferencia = resaltado.indice - resaltados[i - 1].indice
          resaltado.textoCoincidente = resaltados[i - 1].textoCoincidente.substring(0,diferencia) + resaltado.textoCoincidente;
          resaltado.indice = resaltados[i - 1].indice
          acc.pop()
          acc.push(resaltado)
        } else {
          acc.push(resaltado)
        }
        return acc;
      }, [])
      
        //finalmente imprimimos la tajeta modificadas
      resaltadosFiltrados.forEach(resaltado => {
        const textoAnterior =textoTarjeta.substring(ultimoIndice, resaltado.indice)
        textoResaltado += textoAnterior + `<strong class="text-white">${resaltado.textoCoincidente}</strong>`;
        ultimoIndice = resaltado.indice + resaltado.textoCoincidente.length
      })
      
  
      textoResaltado += textoTarjeta.substring(ultimoIndice);

      tarjeta.innerHTML=textoResaltado
      
      //filtrarEventosPorTexto(tarjeta,binding.value)
    }

    }
  },
  
   methods:{
   
   
   filtrarEventosPorTexto:function(tarjetas,arrayTexto){
        const tarjetasconTexto = tarjetas.filter((evento) => {
        
        const coinciden = arrayTexto.every((palabra) => {
          return (
            evento.description.toLowerCase().includes(palabra) ||
            evento.name.toLowerCase().includes(palabra)
          )
          })
          return coinciden;
      })
        return tarjetasconTexto;
      }
         

   , filtrarEventos:function(event){
    const tildados = this.checkbox
    let texto
    if (event.target.className=="form-control me-2 text-white barra"){
      texto = event.target.value
      this.textoABuscar=texto
    }
    else{
      texto=this.textoABuscar
    }
    const arrayTexto = texto.toLowerCase().split(" ");
    let tarjetasFiltradas = this.eventosTotales
    if (tildados.length!=0) {
      tarjetasFiltradas = tarjetasFiltradas.filter(evento => tildados.includes(evento.category)) 
     
    }
    tarjetasFiltradas = this.filtrarEventosPorTexto(tarjetasFiltradas,arrayTexto)

    if (tarjetasFiltradas.length!=0){
      
      this.eventos=tarjetasFiltradas
      this.encontrado=true
     
    }
    
    else {this.encontrado=false
      
    }
    
  } 
    
  }
})

app.mount('#tarjetasVue');

  

class OrientaInformacion extends HTMLElement{

    #template=`
    <style>
        :host{
            display:flex;
            flex-direction:column;
            gap:10px;
            height:100vh;
        }
        h1{
            text-align:center;
        }
        table,
        tr,
        td,
        th,
        tbody,
        thead{
            border:solid 2px black;
            border-collapse: collapse;
        }
        .tDivComunidades{
            display:grid;
            grid-template-columns: repeat(5,auto);
        }
        input[type="button"]{
            margin-top:10px;
            padding:5px 20px;
            border:none;
        }
        input[type="button"]:hover{
            background-color: black;
            color:white;
        }
        #tDivMensaje{
            text-align:center;
            background-color: black;
            color:white;
            text-transform:uppercase;
        }
    </style>
    <h1></h1>
        <form>
        <h2>Elige tu universidad</h2>
        <fieldset>
        <legend>Comunidades</legend>
        <div class="tDivComunidades"></div>
        <br>
        <select id='selGrado' multiple>
                <option disabled value=''>-- Selecciona grado--</option>
        </select>

        <br>
        <input type="button" value="Buscar" id="tBtnEnviar">
        </fieldset>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Universidad</th>
                    <th>Grado</th>
                    <th>Nota De Corte</th>
                    <th>Comunidad</th>
                </tr>
            </thead>
            <tbody id="tTbBody"></tbody>
        </table>

        <div id="tDivMensaje" hidden='hidden'>Información no disponible</div>
    `
    #shadowRoot
//checkbook universidad, comunidad 
//tabla grado, universidad, nota de corte 
    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.#template;
        const notaEBAU = this.notaEBAU()
        this.#shadowRoot.querySelector('h1').innerText=`TU NOTA DE EBAU ES: ${notaEBAU}`

    }

    notaEBAU(){
        const params = new URLSearchParams(window.location.search);
        const notaEBAU = params.get('notaEBAU');
        return notaEBAU;
    }


    async connectedCallback() {
        this.notaEBAU()
        await this.construirCheckboxsComunidades()
        await this.construirSelectModulos()
        this.mostrarUniversidades()

    }

     async construirSelectModulos(){
         try{

             const response=await fetch('http://localhost/00_universidad/rest.php?grados')
             const data = await response.json()
             const nSelect = this.#shadowRoot.querySelector('#selGrado')
             data.forEach(data => {
                
                 const nOpt = document.createElement('option');
                nOpt.value = data.Titulo;
                 nOpt.innerText = data.Titulo;
                 nSelect.appendChild(nOpt);
             });

        }catch(error){
            console.error(`Recuperar Universidad ${error}`)
        }
    }

    async construirCheckboxsComunidades(){
        const response = await fetch('http://localhost/00_universidad/rest.php?comunidades')
        const data = await response.json()

        const nDivComunidades = this.#shadowRoot.querySelector('.tDivComunidades')
        data.forEach(d => {
            const nDiv = document.createElement('div')
            const nLabCom = document.createElement('label')
            nLabCom.setAttribute('for',d.Codigo)
            const nText = document.createTextNode(d.Nombre)

            const nCheckbox = document.createElement('input')
            nCheckbox.setAttribute('type','checkbox')
            nCheckbox.value= d.Codigo
            nCheckbox.setAttribute('id',d.Codigo)
            
            nDivComunidades.appendChild(nDiv)
            nLabCom.appendChild(nText)
            nDiv.appendChild(nCheckbox)
            nDiv.appendChild(nLabCom)
            
        });
    }

    
    mostrarUniversidades(){

        this.#shadowRoot.querySelector('#tBtnEnviar').addEventListener('click', async e => {
            const comunidades = this.#shadowRoot.querySelectorAll('input:checked')
            const grados = this.#shadowRoot.querySelectorAll('option:checked')

            const nTbBd = this.#shadowRoot.querySelector('#tTbBody')
            const notaEBAU = this.notaEBAU()

            // if(grados[0].value){
            //     console.log('relleno')

            // }
            while(nTbBd.hasChildNodes()){
                nTbBd.removeChild(nTbBd.firstChild)
            }


            //muchoa a muchos
            if(comunidades.length>1 && grados.length>1){
                this.mostrarComunidadesYgradosSeleccionados(comunidades,grados,notaEBAU)
            }
            //sino se selecciona ninguno
            if(comunidades.length===0 && grados.length===0){
                await this.mostrarComunidadesYgrados(notaEBAU)

            }

            //si selecciono una comunidad y un grado
            if(comunidades.length===1 && grados.length===1){
                await this.mostrarComunidadYgrado(notaEBAU, comunidades[0].value, grados[0].value)
            }
            

            //solo se selecciona comunidades
            if(comunidades.length>0 && grados.length===0){
                this.mostrarComunidadesSeleccionadas(comunidades,notaEBAU)

                if(comunidades.length===1){
                    await this.mostrarComunidadSeleccionada(comunidades,notaEBAU)
                }
            }

            //solo se selecciona grados
            if(comunidades.length===0 && grados.length>0){
                this.mostrarGradosSeleccionados(grados,notaEBAU)
                if(grados.length===1){
                    await this.mostrarGradoSelecionado(grados,notaEBAU)
                }
            }

            else{
                this.#shadowRoot.querySelector('#tDivMensaje').removeAttribute('hidden')
                setTimeout(() => {
                    this.#shadowRoot.querySelector('#tDivMensaje').setAttribute('hidden','hidden')
                }, 2000);
            }
        })
    }

    mostrarComunidadesYgradosSeleccionados(nInpComunidades,grados,notaEBAU){

        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        nInpComunidades.forEach( comunidad => {

            grados.forEach( async g => {
                const response = await fetch(`http://localhost/00_universidad/rest.php?codComunidad=${comunidad.value}&grado=${g.value}&nota=${notaEBAU}`)

                const data = await response.json()

                data.forEach(d => {
                    const nTr = document.createElement('tr')
                    nTbBd.appendChild(nTr)

                    const nTdUniversidad = document.createElement('td')
                    nTr.appendChild(nTdUniversidad)

                    const nTdTitulo = document.createElement('td')
                    nTr.appendChild(nTdTitulo)

                    const nTdNota = document.createElement('td')
                    nTr.appendChild(nTdNota)

                    const nTdComunidad = document.createElement('td')
                    nTr.appendChild(nTdComunidad)

                    nTdUniversidad.innerText=d.Nombre
                    nTdTitulo.innerText=d.Titulo
                    nTdNota.innerText=d.N_Corte
                    nTdComunidad.innerText=d.comunidad


            })
            

            });

        });
    }
    async mostrarComunidadesYgrados(nota){
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        const response = await fetch(`http://localhost/00_universidad/rest.php?com&grad&nota=${nota}`)
        const data = await response.json()

        data.forEach(d => {
            const nTr = document.createElement('tr')
            nTbBd.appendChild(nTr)

            const nTdUniversidad = document.createElement('td')
            nTr.appendChild(nTdUniversidad)

            const nTdTitulo = document.createElement('td')
            nTr.appendChild(nTdTitulo)

            const nTdNota = document.createElement('td')
            nTr.appendChild(nTdNota)

            const nTdComunidad = document.createElement('td')
            nTr.appendChild(nTdComunidad)

            nTdUniversidad.innerText=d.Nombre
            nTdTitulo.innerText=d.Titulo
            nTdNota.innerText=d.N_Corte
            nTdComunidad.innerText=d.comunidad

        });
    }

    async mostrarComunidadYgrado(nota, comunidad, grado){
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        const response = await fetch(`http://localhost/00_universidad/rest.php?codComunidad=${comunidad}&grado=${grado}&nota=${nota}`)
        const data = await response.json()

        data.forEach(d => {

            const nTr = document.createElement('tr')
            nTbBd.appendChild(nTr)
    
            const nTdUniversidad = document.createElement('td')
            nTr.appendChild(nTdUniversidad)
    
            const nTdTitulo = document.createElement('td')
            nTr.appendChild(nTdTitulo)
    
            const nTdNota = document.createElement('td')
            nTr.appendChild(nTdNota)
    
            const nTdComunidad = document.createElement('td')
            nTr.appendChild(nTdComunidad)
    
            nTdUniversidad.innerText=d.Nombre
            nTdTitulo.innerText=d.Titulo
            nTdNota.innerText=d.N_Corte
            nTdComunidad.innerText=d.comunidad
            
            

        });
    }
    mostrarComunidadesSeleccionadas(comunidades,nota){
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        comunidades.forEach(async comunidad => {
            const response = await fetch(`http://localhost/00_universidad/rest.php?com=${comunidad.value}&nota=${nota}`)
            const data = await response.json()
    
            data.forEach(d => {
                const nTr = document.createElement('tr')
                nTbBd.appendChild(nTr)
    
                const nTdUniversidad = document.createElement('td')
                nTr.appendChild(nTdUniversidad)
    
                const nTdTitulo = document.createElement('td')
                nTr.appendChild(nTdTitulo)
    
                const nTdNota = document.createElement('td')
                nTr.appendChild(nTdNota)
    
                const nTdComunidad = document.createElement('td')
                nTr.appendChild(nTdComunidad)
    
                nTdUniversidad.innerText=d.Nombre
                nTdTitulo.innerText=d.Titulo
                nTdNota.innerText=d.N_Corte
                nTdComunidad.innerText=d.comunidad
    
            });  
        });
        
    }

    async mostrarComunidadSeleccionada(comunidad,nota){
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        const response = await fetch(`http://localhost/00_universidad/rest.php?com=${comunidad[0].value}&nota=${nota}`)
        const data = await response.json()

        data.forEach(d => {
            const nTr = document.createElement('tr')
            nTbBd.appendChild(nTr)

            const nTdUniversidad = document.createElement('td')
            nTr.appendChild(nTdUniversidad)

            const nTdTitulo = document.createElement('td')
            nTr.appendChild(nTdTitulo)

            const nTdNota = document.createElement('td')
            nTr.appendChild(nTdNota)

            const nTdComunidad = document.createElement('td')
            nTr.appendChild(nTdComunidad)

            nTdUniversidad.innerText=d.Nombre
            nTdTitulo.innerText=d.Titulo
            nTdNota.innerText=d.N_Corte
            nTdComunidad.innerText=d.comunidad

        });
    }

    async mostrarGradoSelecionado(grado,nota){
        const response = await fetch(`http://localhost/00_universidad/rest.php?grad=${grado[0].value}&nota=${nota}`)
        const data = await response.json()
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        data.forEach(d => {
            const nTr = document.createElement('tr')
            nTbBd.appendChild(nTr)
    
            const nTdUniversidad = document.createElement('td')
            nTr.appendChild(nTdUniversidad)
    
            const nTdTitulo = document.createElement('td')
            nTr.appendChild(nTdTitulo)
    
            const nTdNota = document.createElement('td')
            nTr.appendChild(nTdNota)
    
            const nTdComunidad = document.createElement('td')
            nTr.appendChild(nTdComunidad)
    
            nTdUniversidad.innerText=d.Nombre
            nTdTitulo.innerText=d.Titulo
            nTdNota.innerText=d.N_Corte
            nTdComunidad.innerText=d.comunidad
        });
    }

    mostrarGradosSeleccionados(grados, nota){
        const nTbBd = this.#shadowRoot.querySelector('#tTbBody')

        grados.forEach(async g => {
            const response = await fetch(`http://localhost/00_universidad/rest.php?grad=${g.value}&nota=${nota}`)
            const data = await response.json()

            data.forEach(d => {
                const nTr = document.createElement('tr')
                nTbBd.appendChild(nTr)
        
                const nTdUniversidad = document.createElement('td')
                nTr.appendChild(nTdUniversidad)
        
                const nTdTitulo = document.createElement('td')
                nTr.appendChild(nTdTitulo)
        
                const nTdNota = document.createElement('td')
                nTr.appendChild(nTdNota)
        
                const nTdComunidad = document.createElement('td')
                nTr.appendChild(nTdComunidad)
        
                nTdUniversidad.innerText=d.Nombre
                nTdTitulo.innerText=d.Titulo
                nTdNota.innerText=d.N_Corte
                nTdComunidad.innerText=d.comunidad
            });
        });

    }

}

window.customElements.define('orienta-informacion',OrientaInformacion)
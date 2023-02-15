export default class FormOrienta extends HTMLElement{
    #template=
    `
    <style>
    
    .añadir{
        margin-top:10px;
        display:grid;
        place-content:center;
    }

    .datos-academicos,
    {
        display:grid;
        grid-template-columns:auto auto;
        gap:20px;
        margin-bottom:10px;
    }
    select,input{
        width:100%;
    }
    select{
        text-align:center;
    }
    .selectores>select{
        margin-bottom:10px;

    }
    #tDivMensaje{
        text-size:30px;
        font-weight: bold;
        text-align:center;
    }
    </style>

    <h1>Calcular nota EBAU</h1>
    <fieldset class="datos-academicos">
        <legend>Datos académidos</legend>
        <label>Nota media de bachillerato</label>
        <input type="number" class='notaBch' value='3'>
        <label>Nota fase general EBAU</label>
        <input type="number" class="notaFG" value='6'>
    </fieldset>
    <fieldset class="datos-ebau">
        1 - Selecciona comunidad
        <legend>Notas de la EBAU</legend>
        <div class='selectores'>
            <select id='selComunidades'>
                <option disabled selected>-- Selecciona comunidad --</option>
            </select>
        </div>
        <br>
        2 - Introduce la nota de las materias examinadas (Fase específica)
        <div id='tDivAsignaturas'>
        
            <div> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' class="notaAsignatura" value='7' placeholder='Introduce tu nota'>
            </div>

            <div class="materia" hidden='hidden'> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' class="notaAsignatura" value="3" placeholder='Introduce tu nota'>
            </div>
            <div class="materia" hidden='hidden'> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' class="notaAsignatura" placeholder='Introduce tu nota'>
            </div>

            <div class="materia" hidden='hidden' id="ultima-asignatura"> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' class="notaAsignatura" placeholder='Introduce tu nota'>
            </div>

            <div class='añadir'>
                <a href='#' id="tPulsar">
                    <img src="./icono.png" width=20 data-contador='1'>
                </a>
            </div>
            
        </div>
        <br>
        <input type="submit" id="tInpEnviar">
        
    </fieldset>

    <div id="tDivMensaje"></div>
    `

    #shadowRoot

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.#template;
    }

    async connectedCallback() {
        
        await this.construirSelectComunidades()

        this.#shadowRoot.querySelector('#selComunidades').addEventListener('change', async e => {
            await this.construirSelectMaterias(e.target.value)
            this.añadirAsignaturas()
        })


        this.#shadowRoot.querySelector('#tInpEnviar').addEventListener('click', e => {
            const notas = this.reccogerNotasFaseEspecifica();
            const notaEBAU = this.calcularEBAU(notas);
            // this.#shadowRoot.querySelector('#tDivMensaje').textContent=`Su nota de EBAU es: ${notaEBAU}`
            setTimeout(() => {
                window.location = `./view/orientaInformacion.html?notaEBAU=${notaEBAU}`;
            }, 3000);
        })


    }
    async construirSelectComunidades(){
        try{
            const response = await fetch("http://localhost/00_universidad/rest.php?comunidades")
            const data = await response.json()

            const nSelect = this.#shadowRoot.querySelector('#selComunidades')
            data.forEach(comunidad => {

                const nOpt = document.createElement('option');
                nOpt.value = comunidad.Codigo;
                // nOpt.setAttribute('id',comunidad.Codigo)
                nOpt.innerText = comunidad.Nombre;
                nSelect.appendChild(nOpt);
            });
        }catch(error){
            console.error(`Recuperar Comunidad ${error}`)
        }
    }


    


    async construirSelectMaterias(comunidad){
        try{
            const response = await fetch(`http://localhost/00_universidad/rest.php?comunidad=${comunidad}`)
            const data = await response.json()

            const nSelects = this.#shadowRoot.querySelectorAll('.selMaterias')
        
            
            data.forEach(dato => {

                for (const select of nSelects) {
                    const nOpt = document.createElement('option');
                    nOpt.value = dato.Nombre;
                    nOpt.innerText = dato.Nombre;
                    nOpt.setAttribute('id',dato.Codigo)
                    select.appendChild(nOpt);
                }
                
            });
            
        }catch(error){
            console.error(error)
        }
        
    
    }


    añadirAsignaturas(){
        this.#shadowRoot.querySelector('#tPulsar').addEventListener('click', e => {
            const nDivMaterias = this.#shadowRoot.querySelectorAll('div .materia')

            for(const materia of nDivMaterias) {
                const hidden = materia.getAttribute('hidden')
                if(hidden){
                    materia.removeAttribute("hidden")

                    if(materia.getAttribute('id') === 'ultima-asignatura'){
                        this.#shadowRoot.querySelector('#tPulsar').setAttribute('hidden','hidden')
                    }
                    
                    break;
                }

            }
        })
    }

    reccogerNotasFaseEspecifica(){
        const notasInp = this.#shadowRoot.querySelectorAll('.notaAsignatura')
        const notaFG = this.#shadowRoot.querySelector('.notaFG').value
        const notaBach = this.#shadowRoot.querySelector('.notaBch').value
        const notas=[];

        if(notaBach != ''){
            notas.push({'bachillerato': parseFloat(notaBach)})
        }

        if(notaFG != ''){
            notas.push({'faseGeneral': parseFloat(notaFG)})
        }

        notasInp.forEach(nota => {
            if(nota.value != ''){
                notas.push({'faseEspecifica':parseFloat(nota.value)})
            }
        });

        return notas;
            
    }

    calcularEBAU(notas){
        let notaEsp=0;

        for (const nota of notas) {
            if(nota.faseEspecifica){
                notaEsp += nota.faseEspecifica*0.2;
            }
        }
        const notaEBAU = notaEsp + (0.6*notas[0].bachillerato) + (0.4*notas[1].faseGeneral)
        return notaEBAU

    }
}


window.customElements.define('form-orienta',FormOrienta)
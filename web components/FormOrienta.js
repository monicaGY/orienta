export default class FormOrienta extends HTMLElement{
    #template=
    `
    <style>
    fieldset,
    #tDivAsignaturas{
        display:flex;
        flex-direction: column;
        width:0;
        gap:10px
    }
    a{
        text-align:center;
    }

   
    </style>
    <fieldset>

        <legend>Notas de la EBAU</legend>
        <select id='selComunidades'>
            <option disabled selected>-- Selecciona comunidad --</option>
        </select>
        
        <div id='tDivAsignaturas'>

            <div> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' placeholder='Introduce tu nota'>
            </div>

            <div class="materia" hidden='hidden'> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' placeholder='Introduce tu nota'>
            </div>
            <div class="materia" hidden='hidden'> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' placeholder='Introduce tu nota'>
            </div>

            <div class="materia" hidden='hidden' id="ultima-asignatura"> 
                <select class='selMaterias' >
                        <option disabled selected>-- Selecciona materia --</option>
                </select>
                <input type='number' placeholder='Introduce tu nota'>
            </div>

        </div>
        <a href='#' id="tPulsar">
            <img src="./icono.png" width=20 data-contador='1'>
        </a>
        
        <select id='selUniversidad'>
                <option disabled selected>-- Selecciona universidad--</option>
        </select>
    </fieldset>
    `

    #shadowRoot

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.#template;
    }

    async connectedCallback() {
        await this.construirSelectUnisersidades()
        await this.construirSelectComunidades()
        await this.construirSelectMaterias()

        this.añadirAsignaturas()

    }
    async construirSelectComunidades(){
        try{
            const response = await fetch("http://localhost/00_universidad/rest.php?comunidad")
            const data = await response.json()

            const nSelect = this.#shadowRoot.querySelector('#selComunidades')
            data.forEach(data => {
                const nOpt = document.createElement('option');
                nOpt.value = data.Comunidad;
                nOpt.innerText = data.Comunidad;
                nSelect.appendChild(nOpt);
            });
        }catch(error){
            console.error(`Recuperar Comunidad ${error}`)
        }
    }


    async construirSelectUnisersidades(){
        try{

            //la ruta: en el fichero de las consultas
            const response=await fetch('http://localhost/00_universidad/rest.php?universidad')
            const data = await response.json()

            const nSelect = this.#shadowRoot.querySelector('#selUniversidad')
            data.forEach(data => {
                const nOpt = document.createElement('option');
                nOpt.value = data.Universidad;
                nOpt.innerText = data.Universidad;
                nSelect.appendChild(nOpt);
            });

        }catch(error){
            console.error(`Recuperar Universidad ${error}`)
        }
    }


    async construirSelectMaterias(){
        try{
            const response = await fetch('http://localhost/00_universidad/rest.php?materia')
            const data = await response.json()
            const nSelects = this.#shadowRoot.querySelectorAll('.selMaterias')
        
            
            data.forEach(dato => {

                for (const select of nSelects) {
                    const nOpt = document.createElement('option');
                    nOpt.value = dato.nombre;
                    nOpt.innerText = dato.nombre;
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
                        this.#shadowRoot.querySelector('a').setAttribute('hidden','hidden')
                    }
                    
                    break;
                }

            }
        })
    }
}


window.customElements.define('form-orienta',FormOrienta)
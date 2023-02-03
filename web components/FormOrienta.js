class FormOrienta extends HTMLElement{
    #template=
    `<select id='selComunidades'>
        <option disabled selected>-- Selecciona comunidad --</option>
    </select>
    <select id='selUniversidad'>
            <option disabled selected>-- Selecciona universidad--</option>
        </select>
    `
    #shadowRoot

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.#template;

    }

    async connectedCallback() {
        await this.retrieveUnisersidades()
        await this.retrieveComunidades()
    }
    async retrieveComunidades(){
        try{
            const response = await fetch("http://localhost/00_universidad/rest.php?comunidad")
            const data = await response.json()
            this.rellenarSelComunidad(data)
        }catch(error){
            console.error(`Recuperar Comunidad ${error}`)
        }
    }

    rellenarSelComunidad(comunidades){
        try{
            const nSelect = this.#shadowRoot.querySelector('#selComunidades')
            comunidades.forEach(comunidad => {
                const nOpt = document.createElement('option');
                nOpt.value = comunidad.Comunidad;
                nOpt.innerText = comunidad.Comunidad;
                nSelect.appendChild(nOpt);
            });
        }catch(error){
            console.error(`Slector Comunidad ${error}`)

        }
    }

    async retrieveUnisersidades(){
        try{

            //la ruta: en el fichero de las consultas
            const response=await fetch('http://localhost/00_universidad/rest.php?universidad')
            const universidades = await response.json()

            this.rellenarSelect(universidades)
            

        }catch(error){
            console.error(`Recuperar Universidad ${error}`)
        }
    }

    rellenarSelect(universidades){
        try{
            const nSelect = this.#shadowRoot.querySelector('#selUniversidad')
            universidades.forEach(universidad => {
                const nOpt = document.createElement('option');
                nOpt.value = universidad.Universidad;
                nOpt.innerText = universidad.Universidad;
                nSelect.appendChild(nOpt);
            });
        }catch(error){
            console.error(`Select Universidad ${error}`)

        }
    }
}


window.customElements.define('form-orienta',FormOrienta)
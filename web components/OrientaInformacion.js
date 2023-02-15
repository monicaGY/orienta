class OrientaInformacion extends HTMLElement{

    #template=`
    <h1></h1>
        <form>
        <h2>Elige tu universidad</h2>
        <fieldset>
        <legend>Comunidades</legend>
        <div class="tDivComunidades"></div>
        <br>
        <select id='selGrado' multiple>
                <option disabled selected>-- Selecciona grado--</option>
        </select>

        <br>
        <input type="button" value="Buscar" id="tBtnEnviar">
        </fieldset>
        </form>
        <table border="1">
            <thead>
                <tr>
                    <td>Universidad</td>
                    <td>Nota De Corte</td>
                    <td>Grado</td>
                    <td>Comunidad</td>
                </tr>
            </thead>
            <tbody id="tTbBody"></tbody>
        </table>
    `
    #shadowRoot
//checkbook universidad, comunidad 
//tabla grado, universidad, nota de corte 
    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.#template;
        
    }

    notaEBAU(){
        const params = new URLSearchParams(window.location.search);
        const notaEBAU = params.get('notaEBAU');
        this.#shadowRoot.querySelector('h1').innerText=`TU NOTA DE EBAU ES: ${notaEBAU}`
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
                //  nOpt.value = data.Nombre;
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
            const nLabCom = document.createElement('label')
            nLabCom.setAttribute('for',d.Codigo)
            const nText = document.createTextNode(d.Nombre)

            const nCheckbox = document.createElement('input')
            nCheckbox.setAttribute('type','checkbox')
            nCheckbox.value= d.Codigo
            nCheckbox.setAttribute('id',d.Codigo)

            nLabCom.appendChild(nText)
            nDivComunidades.appendChild(nCheckbox)
            nDivComunidades.appendChild(nLabCom)
            
        });
    }

    
    mostrarUniversidades(){

        this.#shadowRoot.querySelector('#tBtnEnviar').addEventListener('click', e => {
            const nInpComunidades = this.#shadowRoot.querySelectorAll('input:checked')
            const nTbBd = this.#shadowRoot.querySelector('#tTbBody')
            const grado = this.#shadowRoot.querySelector('#selGrado').value
            // const grados = this.#shadowRoot.querySelectorAll('option:checked')

            console.log(grados)
            while(nTbBd.hasChildNodes()){
                nTbBd.removeChild(nTbBd.firstChild)
            }


            nInpComunidades.forEach(async comunidad => {
                const response = await fetch(`http://localhost/00_universidad/rest.php?codComunidad=${comunidad.value}&grado=${grado}`)

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
        })
    }
}

window.customElements.define('orienta-informacion',OrientaInformacion)
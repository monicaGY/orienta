const template1 = document.createElement('template');
template1.innerHTML = `
    <style>

    </style>

    <div>
        <label>Universidad:</label>
        <select class="tSelUniversidades">
            <option selected disabled>Elige una universidad</option>
        </select>
    </div>
    <div>
         <label>Equipos:</label>
         <select class="tSelEquipos">
             <option selected disabled>Elige un equipo</option>
         </select>
    </div>

    
`;
    

class Universidad extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template1.content.cloneNode(true));
    }

    async connectedCallback() {
        const nSelUniversidads = this.shadowRoot.querySelector('.tSelUniversidades');
        nSelUniversidads.onchange = e => this.retrieveTeamsByConference(e);
        await this.retrieveUniversidades()

    }

    async retrieveUniversidades() {
        try {
            const response = await fetch('http://127.0.0.1/00_universidad/rest.php?universidad', { method: 'GET' });
            console.log(`uni ${response}`)
            const data = await response.json();
            this.fillUniversidades(data);
        } catch(e) {
            console.error(e);
        }
    }

    fillUniversidades(universidades) {
        const nSelUniversidad = this.shadowRoot.querySelector('.tSelUniversidades');
        universidades.forEach(universidad => {
            const nOpt = document.createElement('option');
            nOpt.value = universidad.Universidad;
            nOpt.innerText = universidad.Universidad;
            nSelUniversidad.appendChild(nOpt);
        });
    }

    async retrieveTeamsByConference(e) {
        const universidad = e.target.value;
        try {
            const response = await fetch(`http://127.0.0.1/00_universidad/rest.php?universidad=${universidad}`, { method: 'GET' });
            const data = await response.json();
            this.fillTeamsByConference(data);
        } catch(e) {
            console.error(e);
        }
    }

    fillTeamsByConference(teams) {
        const nSelEquipos = this.shadowRoot.querySelector('.tSelEquipos');
        nSelEquipos.innerHTML = '<option selected disabled>Elige un equipo</option>';
        teams.forEach(team => {
            const nOpt = document.createElement('option');
            nOpt.value = team.Nombre;
            nOpt.innerText = team.Nombre;
            nSelEquipos.appendChild(nOpt);
        });
    }
}

customElements.define("orienta-universidades", Universidad);
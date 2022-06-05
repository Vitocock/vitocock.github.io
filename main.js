/*
{
    id: "FLXV-47",
    max_arrival_time: 3,
    meters_distance: 1,
    min_arrival_time: 0,
    service: "506"
}
*/
const createTable = (name) => {
    return `
    <h3>${name}</h3>    
    <table>
    <tbody id="table">
        <tr>
            <th>Recorrido</th>
            <th>Distancia</th>
            <th>Tiempo estimado</th>
        </tr>      
    </tbody>
    </table>`
}
const busTemplate = (bus) => {
    return `
    <tr>
        <td>${bus.service}</td>
        <td>${bus.meters_distance} mts.</td>
        <td>${bus.min_arrival_time}</td>
    </tr>
    `
}
const getBusData = async (stop) => {
    const response = await fetch(`https://api.xor.cl/red/bus-stop/${stop}`);
    const resData = await response.text();
    return JSON.parse(resData);
}
const sortBuses = (services) => {
    const busList = [];
    for (let service of services) {
        if (service.valid) {
            const { buses } = service
            buses.forEach(bus => {
                bus['service'] = service.id
                busList.push(bus) 
            });
        }
    }
    busList.sort((prevBus, nextBus) => prevBus.meters_distance - nextBus.meters_distance)
    return busList
}
const displayTable = (response) => {
    const services = response.services;
    const sortedBuses = sortBuses(services);

    const busInfo = document.getElementById('bus-info')
    busInfo.innerHTML = createTable(response.name)

    const table = document.getElementById('table')
     
    const fragment = document.createDocumentFragment()
    for (let bus of sortedBuses) {
        const busTr = document.createElement('tr')
        busTr.innerHTML = busTemplate(bus)
        fragment.appendChild(busTr)
    }

    table.appendChild(fragment)
}
const getFormData = (form) => {
    let formData = new FormData(form);
    formData = Object.fromEntries(formData.entries())
    return formData 
}
const addFormSumbit = () => {
    const form = document.getElementById('form');

    form.onsubmit = async (event) => {
        event.preventDefault();
    
        const formData = getFormData(form)
    
        const response = await getBusData(formData.stop);
        displayTable(response)
    }
}


window.onload = () => {
    addFormSumbit()
    setSaveButton()

    const localStop = getLocalStop()

    if (localStop) {
        displaySaveForm(localStop)
    }
}
const getLocalStop = () => {
    return JSON.parse(localStorage.getItem('stops'))
}
const delLocalStop = (stopIndex) => {
    const localStops = getLocalStop()
    localStops.splice(stopIndex, 1)

    localStorage.setItem('stops', JSON.stringify(localStops))
}
const delStopButton = (stopIndex) => {
    const delButton = document.createElement('button')
    delButton.setAttribute('value', stopIndex)
    delButton.innerText = 'Borrar'

    delButton.addEventListener('click', (event) => {
        event.preventDefault()

        delLocalStop(stopIndex)
        delButton.parentElement.remove()
    })

    return delButton
}
const setButtonValues = (stop) => {
    const stopButton = document.createElement('button')

    stopButton.setAttribute('value', stop['stop'])
    stopButton.classList.add('stop-button')
    stopButton.innerText = stop['stop-name']

    stopButton.addEventListener('click', async (event) => {
        event.preventDefault()

        const response = await getBusData(stopButton.value)
        displayTable(response)
        
    })

    return stopButton
}
const setSaveButton = () => {
    const saveBtn = document.getElementById('save')

    saveBtn.addEventListener('click', (event) => {
        event.preventDefault()

        createSaveForm()

        saveBtn.remove()
        
    })
}
const createSaveForm = () => {
    const saveForm = document.getElementById('save-form')
    saveForm.classList.remove('hide')   
    
    saveForm.onsubmit = () => {
        const formData = getFormData(saveForm)

        const localStops = getLocalStop()

        if (localStops) {
            localStops.push(formData)
            localStorage.setItem('stops', JSON.stringify(localStops))
            
        } else {
            localStorage.setItem('stops', JSON.stringify([formData]))
        }

    }
}
const displaySaveForm = (stops) => {
    const divForm = document.getElementById('div-form')

    const fragment = document.createDocumentFragment()

    for (let stopIndex in stops) {
        const div = document.createElement('div')
        div.classList.add('div-buttons')
        const stop = stops[stopIndex]

        const stopButton = setButtonValues(stop)
        const delButton = delStopButton(stopIndex)

        div.appendChild(stopButton)
        div.appendChild(delButton)

        fragment.appendChild(div)
    }

    divForm.appendChild(fragment)
}
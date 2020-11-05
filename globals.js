const { send } = require('./index')

let state = {
    status: 'RESTING',
    numberOfToothsLeft: 0,
    settings: {
        totalNumberOfTooths: 0,
    }
}


function setStatus(val) {
    state.status = val
    send(state.status)
}

async function setSettings(val) {
    state.settings = val
    send(state.settings)
}

function setToothsLeft(val) {
    state.numberOfToothsLeft = val
    send(state.numberOfToothsLeft)
}

function getState() {
    return state
}

function getSettings() {
    return state.settings
}

function getToothsLeft(val) {
    return state.numberOfToothsLeft
}

module.exports = { getState, setStatus, setSettings, setToothsLeft, getSettings, getToothsLeft }
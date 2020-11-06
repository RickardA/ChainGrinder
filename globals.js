const { sendMessage } = require('./index')

let state = {
    status: 'RESTING',
    numberOfToothsLeft: 0,
    settings: {
        totalNumberOfTooths: 0,
    }
}


function setStatus(val) {
    state.status = val
    sendMessage(state.status)
}

async function setSettings(val) {
    state.settings = val
    sendMessage(state.settings)
}

function setToothsLeft(val) {
    state.numberOfToothsLeft = val
    sendMessage(state.numberOfToothsLeft)
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
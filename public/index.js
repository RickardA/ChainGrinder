let socket
const statusLabel = document.getElementById('statusLabel')
const timeLabel = document.getElementById('timeLabel')
const settingsPage = document.getElementById('settingsPage')
const homePage = document.getElementById('homePage')
const toothInput = document.getElementById('toothInput')
const toothsLeft = document.getElementById('toothsLeft')
const lowerGrinderBtn = document.getElementById('lowerGrinderBtn')
const raiseGrinderBtn = document.getElementById('raiseGrinderBtn')
const angleGrinderBtn = document.getElementById('angleGrinderBtn')
const cancelBtn = document.getElementById('cancelBtn')
const startBtn = document.getElementById('startBtn')
const moveChainBtn = document.getElementById('moveChainBtn')
const startGrinderBtn = document.getElementById('startGrinderBtn')
const stopGrinderBtn = document.getElementById('stopGrinderBtn')
const checkLengthGrindingBtn = document.getElementById('checkLengthGrindingBtn')
const quitCheckLengthGrindingBtn = document.getElementById('quitCheckLengthGrindingBtn')
const clapmChainBtn = document.getElementById('clapmChainBtn')
const releaseChainBtn = document.getElementById('releaseChainBtn')
const checkbox = document.getElementById('checkbox')
const leftMenuBtn = document.getElementById('leftMenuBtn')
const rightMenuBtn = document.getElementById('rightMenuBtn')
const manualControlMenuLabel = document.getElementById('manualControlMenuLabel')
const autoGridningMenuLabel = document.getElementById('autoGridningMenuLabel')
const lengthGrindingOffButton = document.getElementById('lengthGrindingOffButton')
const lengthGrindingOnButton = document.getElementById('lengthGrindingOnButton')


toothInput.onclose = inputChanged

let connected = false

let grinder = {
    status: 'RESTING',
    chainClamped: false,
    grinderLowered: false,
    grinderOn: false,
    pushingChain: false,
    lenghtGrinderActive: false,
    angleAltered: false,
    numberOfToothsLeft: 0,
    settings: {
        totalNumberOfTooths: 0,
        lengthGrindingActivated: false,
    }
}

function onLoad () {
    connect()
    leftMenuBtnPressed()
    displayCurrentTime()
}

onLoad()

function handleMessage (msg) {
    console.log("grinder", msg)
    switch (msg.type) {
        case 'STATUS':
            updateStatusLabel(msg.status)
            break;
        case 'NUMBEROFTOOTHS':
            updateNumberOfToothsLeft(msg.numberOfToothsLeft)
            break;
        case 'TOTALTOOTHS':
            updateTotalTooths(msg.value)
            break;
        case 'SETTINGS':
            updateSettings(msg.settings)
            break;
        case 'COMPLETE':
            updateEverything(msg.complete)
            break;
        case 'CHAINCLAMPED':
            grinder.chainClamped = msg.val
            updateSetupButtons()
            break;
        case 'GRINDERLOWERED':
            grinder.grinderLowered = msg.val
            updateSetupButtons()
            break;
        case 'GRINDERON':
            grinder.grinderOn = msg.val
            updateSetupButtons()
            break;
        case 'CHAINPUSHER':
            grinder.pushingChain = msg.val
            updateSetupButtons()
            break;
        case 'ALTEREDANGLE':
            grinder.angleAltered = msg.val
            updateSetupButtons()
            break;
        case 'LENGHTGRINDER':
            grinder.lenghtGrinderActive = msg.val
            updateSetupButtons()
            break;
        case 'LENGTHGRINDINGACTIVATED':
            grinder.settings.lengthGrindingActivated = msg.val
            updateLengthGrindingButtons()
    }
}

function updateSetupButtons () {
    console.log("updateSetupButtons")
    if (grinder.status.includes('GRINDING')) {
        checkLengthGrindingBtn.disabled = true
        quitCheckLengthGrindingBtn.disabled = true
        angleGrinderBtn.disabled = true
        moveChainBtn.disabled = true
        startGrinderBtn.disabled = true
        stopGrinderBtn.disabled = true
        lowerGrinderBtn.disabled = true
        raiseGrinderBtn.disabled = true
        clapmChainBtn.disabled = true
        releaseChainBtn.disabled = true
        return
    }
    checkLengthGrindingBtn.disabled = grinder.lenghtGrinderActive
    quitCheckLengthGrindingBtn.disabled = !grinder.lenghtGrinderActive
    angleGrinderBtn.disabled = grinder.grinderLowered
    moveChainBtn.disabled = grinder.pushingChain || grinder.chainClamped || grinder.lenghtGrinderActive || grinder.grinderLowered
    startGrinderBtn.disabled = grinder.grinderOn || grinder.grinderLowered
    stopGrinderBtn.disabled = !grinder.grinderOn
    lowerGrinderBtn.disabled = false
    raiseGrinderBtn.disabled = false
    clapmChainBtn.disabled = grinder.chainClamped || grinder.pushingChain
    releaseChainBtn.disabled = !grinder.chainClamped
}

function updateTotalTooths (val) {
    grinder.settings.totalNumberOfTooths = val
    if (grinder.settings.totalNumberOfTooths === 0 || grinder.settings.totalNumberOfTooths == null) {
        startBtn.disabled = true
    } else {
        startBtn.disabled = false
    }
    toothInput.innerHTML = `${grinder.settings.totalNumberOfTooths}`
}

function updateStatusLabel (status) {
    if (grinder.status) grinder.status = status
    statusLabel.innerHTML = connected ? `Ansluten - ${getStatusMsg()}` : 'Ansluter...'
    updateButtonsDisabledState()
}

function updateNumberOfToothsLeft (tooths) {
    grinder.numberOfToothsLeft = tooths
    toothsLeft.innerHTML = `${grinder.numberOfToothsLeft}`
}

function updateSettings (settings) {
    grinder.settings = settings
    toothInput.innerHTML = `${grinder.settings.totalNumberOfTooths}`
}

function updateEverything (everything) {
    console.log("update everything", everything)
    grinder = everything
    updateGUI()
}

function updateGUI () {
    console.log("grind", grinder)
    statusLabel.innerHTML = connected ? `Ansluten - ${getStatusMsg()}` : 'Ansluter...'
    toothsLeft.innerHTML = `${grinder.numberOfToothsLeft}`
    toothInput.innerHTML = `${grinder.settings.totalNumberOfTooths}`
    updateButtonsDisabledState()
}

function updateLengthGrindingButtons () {
    console.log('update length grinding buttons')
    lengthGrindingOnButton.disabled = grinder.settings.lengthGrindingActivated || grinder.status !== 'RESTING'
    lengthGrindingOffButton.disabled = !grinder.settings.lengthGrindingActivated || grinder.status !== 'RESTING'
}

function updateButtonsDisabledState () {
    updateSetupButtons()
    updateLengthGrindingButtons()
    if (grinder.status !== 'RESTING') {
        startBtn.disabled = true
        if (grinder.status !== 'GRINDING') {
            console.log("Disable  cancel button: ", grinder.status)
            cancelBtn.disabled = true
        } else {
            cancelBtn.disabled = false
        }
        toothInput.disabled = true
    } else {
        if (grinder.settings.totalNumberOfTooths === 0 || grinder.settings.totalNumberOfTooths == null || grinder.chainClamped || grinder.grinderLowered || grinder.grinderOn || grinder.pushingChain || grinder.lenghtGrinderActive) {
            startBtn.disabled = true
        } else {
            startBtn.disabled = false
        }
        cancelBtn.disabled = true
        toothInput.disabled = false
    }
}

function getStatusMsg () {
    switch (grinder.status) {
        case 'RESTING':
            return 'Vilar'
            break;
        case 'LOWERING':
            return 'Sänker...'
            break;
        case 'LIFTING':
            return 'Lyfter...'
            break;
        case 'ALTERING ANGLE':
            return 'Vinklar...'
            break;
        case 'GRINDING':
            return 'Slipar...'
            break;
        case 'STOP':
            return 'Stannar...'
            break;
        case 'SETUP':
            return 'Startar inställnings läge...'
            break;
        case 'SETUPSTARTED':
            return 'Inställnings läge aktivt'
            break;
        case 'STARTINGGRIDNER':
            return 'Startar slip...'
            break;
        case 'STOPPINGGRINDER':
            return 'Stannar slip...'
            break;
        case 'PUSHINGCHAIN':
            return 'Flyttar kedja...'
            break;
        case 'CHECKINGLENGTHGRINDING':
            return 'Aktiverar inställning av längdslip...'
            break;
        case 'QUITCHECKLENGTHGRINDING':
            return 'Avslutar inställning av längdslip...'
            break;
        case 'RELEASINGCHAIN':
            return 'Släpper Kedja...'
            break;
        case 'CLAMPINGCHAIN':
            return 'Klämmer kedja...'
    }

}

////////////////////////////// GUI Stuff //////////////////////////////////////////

let prevInput = ""
function inputChanged (e) {
    console.log('on close')
    setNumberOfTooths()
}

function checkboxClicked (value) {
    socket.send(JSON.stringify({ command: 'LENGTHGRINDINGACTIVE', value }))
}


///////////////////////////// Socket stuff ////////////////////////////////////////

function connect () {
    connected = false
    updateGUI()
    socket = new WebSocket(`ws://${window.location.hostname}:8080`)

    socket.onopen = () => {
        console.log('Connected')
        connected = true
        updateGUI()
    }

    socket.onmessage = (evt) => {
        console.log('Recieved message: ', evt.data)
        handleMessage(JSON.parse(evt.data))
    }

    socket.onclose = () => {
        console.log('Connection is closed')
        connected = false
        updateGUI()
        setTimeout(function () {
            connect();
        }, 1000);
    }

    socket.onerror = (err) => {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        socket.close();
    };
}

////////////////////////// Grinder stuff ////////////////////////////////

function setNumberOfTooths () {
    console.log('Number of tooths: ', toothInput.value)
    socket.send(JSON.stringify({ command: 'NUMBEROFTOOTHS', value: parseInt(toothInput.value) }))
}

function lowerTapped () {
    socket.send(JSON.stringify({ command: 'LOWER' }))
}

function liftTapped () {
    socket.send(JSON.stringify({ command: 'LIFT' }))
}

function alterAngleTapped () {
    socket.send(JSON.stringify({ command: 'ALTER ANGLE' }))
}

function setupSequenceTapped () {
    socket.send(JSON.stringify({ command: 'SETUP SEQUENCE' }))
}

function start () {
    socket.send(JSON.stringify({ command: 'START' }))
}

function stop () {
    socket.send(JSON.stringify({ command: 'STOP' }))
}

function status () {
    socket.send(JSON.stringify({ command: 'STATUS' }))
}

function startGrinder () {
    socket.send(JSON.stringify({ command: 'STARTGRINDER' }))
}

function stopGrinder () {
    socket.send(JSON.stringify({ command: 'STOPGRINDER' }))
}

function moveChain () {
    socket.send(JSON.stringify({ command: 'PUSHCHAIN' }))
}

function checkLengthGrinding () {
    socket.send(JSON.stringify({ command: 'CHECKLENGTHGRINDING' }))
}

function quitCheckLengthGrinding () {
    socket.send(JSON.stringify({ command: 'QUITCHECKLENGTHGRINDING' }))
}

function clampChain () {
    socket.send(JSON.stringify({ command: 'CLAMPCHAIN' }))
}

function releaseChain () {
    socket.send(JSON.stringify({ command: 'RELEASECHAIN' }))
}

///////////////////////// Time stuff /////////////////////////////////

function displayCurrentTime () {
    const today = new Date();
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const h = today.getHours();
    let m = today.getMinutes();
    m = padWithZero(m);
    timeLabel.innerHTML = `${year}-${padWithZero(month)}-${padWithZero(day)} ${h}:${m}`
    setTimeout(displayCurrentTime, 1000);
}

function padWithZero (i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function powerOff () {
    socket.send(JSON.stringify({ command: 'SHUTDOWN' }))
}

function rightMenuBtnPressed () {
    settingsPage.style.visibility = 'hidden'
    settingsPage.style.height = '0'
    settingsPage.classList.remove('m-flex-1')
    homePage.style.visibility = 'visible'
    homePage.classList.add('m-flex-1')
    homePage.style.height = '100%'
    manualControlMenuLabel.style.fontSize = "15px"
    autoGridningMenuLabel.style.fontSize = "20px"
    autoGridningMenuLabel.style.opacity = "100%"
    manualControlMenuLabel.style.opacity = "50%"
    leftMenuBtn.disabled = false
    rightMenuBtn.disabled = true
}

function leftMenuBtnPressed () {
    homePage.style.visibility = 'hidden'
    homePage.style.height = '0'
    homePage.classList.remove('m-flex-1')
    settingsPage.style.visibility = 'visible'
    settingsPage.classList.add('m-flex-1')
    settingsPage.style.height = '100%'
    manualControlMenuLabel.style.fontSize = "20px"
    autoGridningMenuLabel.style.fontSize = "15px"
    autoGridningMenuLabel.style.opacity = "50%"
    manualControlMenuLabel.style.opacity = "100%"
    leftMenuBtn.disabled = true
    rightMenuBtn.disabled = false
}

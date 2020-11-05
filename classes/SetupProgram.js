const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const EventEmitter = require('events')

module.exports = class SetupProgram extends EventEmitter {

    constructor() {
        if(! SetupProgram.instance) {
            super()
            SetupProgram.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()

            this.setupSequenceIsRunning = false

            this.checkAndSetSequence()
        }

        return SetupProgram.instance
    }

    checkAndSetSequence() {
        if(this.chainGuard.isClamped() || this.grinder.isLowered()) {
            this.setupSequenceIsRunning = true
        }
    }

    alterGrinderAngle() {
        setStatus('ALTERING ANGLE')
        this.grinder.alterAngle()
        setStatus('RESTING')
    }

    async liftGrinder() {
        setStatus('LIFTING')
        await this.grinder.lift()
        setStatus('RESTING')
    }

    async lowerGrinder() {
        setStatus('LOWERING')
        await this.grinder.lower()
        setStatus('RESTING')
    }

    async runSetupSequence() {
        console.log('Running setup sequence...')
        if(!this.setupSequenceIsRunning) {
            setStatus('SETUP')
            this.setupSequenceIsRunning = true
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            await this.grinder.lower()
            console.log('Setup sequence done')
            this.emit('setupStarted',true)
        } else {
            await this.stopSetupSequence()
            this.setupSequenceIsRunning = false
            setStatus('RESTING')
        }
    }

    async stopSetupSequence() {
        console.log('Stopping setup sequence...')
        await this.grinder.lift()
        await Promise.all([this.grinder.turnOff(), this.chainGuard.releaseChain()])
        console.log('Setup sequence stopped')
        this.emit('setupStopped',true)
    }
}
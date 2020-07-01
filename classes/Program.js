const Grinder = require('./classes/Grinder')
const ChainGuard = require('./classes/ChainGuard')
const Relay = require('./classes/Relay')
const Gpio = require('pigpio').Gpio

module.exports = class Program {

    constructor() {
        if(! Program.instance) {
            Program.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            this.pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
            this.grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT,{mode: Gpio.INPUT, alert: true})

            this.pushChainInput.on('alert', (level, input) => this.handleChainInput(level, input))
            this.grinderInput.on('alert', (level, input) => this.handleGrinderInput(level, input))

            this.handleGrinderInput = false
            this.setupSequenceIsRunning = false
        }

        return Program.instance
    }

    alterGrinderAngle() {
        this.grinder.alterAngle()
    }

    async runSetupSequence() {
        console.log('Running setup sequence...')
        if(!this.setupSequenceIsRunning) {
            this.handleGrinderInput = false
            this.setupSequenceIsRunning = true
            await Promise.all([this.chainGuard.pushChain(), this.grinder.alterAngle()])
            await this.chainGuard.clampChain()
            await this.grinder.turnOn()
            await this.grinder.lower()
            console.log('Setup sequence done')
        } else {
            await this.stopSetupSequence()
            this.setupSequenceIsRunning = false
        }
    }

    stopSetupSequence() {
        console.log('Stopping setup sequence...')
        await this.grinder.lift()
        await Promise.all([this.grinder.turnOff(), this.chainGuard.releaseChain()])
        console.log('Setup sequence stopped')
    }

    handleChainInput(level, tick) {
        console.log('Got chain input... ', level)
        if(level === 1 && this.chainGuard.isPushed()) {
            console.log('Chain pusher is not origin')
            this.chainGuard.isChainPusherOrigin = false
        } else if(level === 0 && !this.chainGuard.isPushed()){
            console.log('Chain pusher is origin')
            this.chainGuard.isChainPusherOrigin = true
        }
    }

    handleGrinderInput(level, tick) {
        console.log('Got grinder input... ', level)
        if(level === 1 && !this.grinder.liftTimerIsStarted && this.handleGrinderInput) {
            console.log('Starting lift timer')
            this.grinder.startLiftTimer()
        }
    }
}

//const magic = new Relay(19,false)
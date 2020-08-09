const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const Gpio = require('pigpio').Gpio
const EventEmitter = require('events')

module.exports = class Program extends EventEmitter {

    constructor() {
        if(! Program.instance) {
            super()
            Program.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            this.pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
            this.grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT,{mode: Gpio.INPUT, alert: true})

            this.pushChainInput.glitchFilter(300000)
            this.grinderInput.glitchFilter(300000)
        }

        return Program.instance
    }

    async exit() {
        await this.grinder.lift()
        await this.grinder.turnOff()
        await this.chainGuard.releaseChain()
        process.exit()
        
    }

    alterGrinderAngle() {
        this.grinder.alterAngle()
    }

    async startProgram() {
        do {
            await this.chainGuard.releaseChain()
            await this.grinder.alterAngle()
            await this.chainGuard.pushChain()
            await this.chainGuard.clampChain()
            await this.grinder.turnOn()
            await this.grinder.lower()
            await this.grinder.startLiftTimer()
            await this.grinder.turnOff()
            console.log('One iteration done')
        } while(this.teethCounter != 2) 
        
        this.emit('done', true)
    }

    async continueProgram() {
        await this.chainGuard.clampChain()
        await this.grinder.turnOn()
        await this.grinder.lower()
    }

    async stopSetupSequence() {
        console.log('Stopping setup sequence...')
        await this.grinder.lift()
    }

    async turnOffAndReleaseChain() {
        await Promise.all([this.grinder.turnOff(), this.chainGuard.releaseChain()])
        console.log('Setup sequence stopped')
        this.emit('setupStopped',true)
    }
}
const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const Gpio = require('pigpio').Gpio

module.exports = class SetupProgram {

    constructor() {
        if(! SetupProgram.instance) {
            SetupProgram.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            this.pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
            this.grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT,{mode: Gpio.INPUT, alert: true})

            this.pushChainInput.glitchFilter(300000)
            this.grinderInput.glitchFilter(300000)

            this.pushChainInput.on('alert', (level, input) => {
                console.log(level)
                if(level === 0 && !this.chainGuard.isPushed()) {
                    this.continueSetupSequence()
                }
            })

            this.grinderInput.on('alert', (level, input) => {
               console.log('grinderLevel ', level,)
                if (level == 0 && !this.grinder.isLowered()) {
                    this.turnOffAndReleaseChain()
                }
            })

            this.setupSequenceIsRunning = false
        }

        return SetupProgram.instance
    }

    checkAndSetSequence() {
        if(this.chainGuard.isClamped() || this.grinder.isLowered()) {
            this.setupSequenceIsRunning = true
        }
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

    async runSetupSequence() {
        console.log('Running setup sequence...')
        if(!this.setupSequenceIsRunning) {
            this.setupSequenceIsRunning = true
            await Promise.all([this.chainGuard.pushChain(), this.grinder.alterAngle()])
        } else {
            await this.stopSetupSequence()
            this.setupSequenceIsRunning = false
        }
    }

    async continueSetupSequence() {
        await this.chainGuard.clampChain()
        await this.grinder.turnOn()
        await this.grinder.lower()
        console.log('Setup sequence done')
    }

    async stopSetupSequence() {
        console.log('Stopping setup sequence...')
        await this.grinder.lift()
    }

    async turnOffAndReleaseChain() {
        await Promise.all([this.grinder.turnOff(), this.chainGuard.releaseChain()])
        console.log('Setup sequence stopped')
    }
}
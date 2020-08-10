const Relay = require('./Relay')
const Gpio = require('pigpio').Gpio

module.exports = class ChainGuard{

    constructor() {
        if(!ChainGuard.instance) {
            this.clampRelay = new Relay(process.env.CHAINGUARD_CLAMP_PIN,false)
            this.pushRelay = new Relay(process.env.CHAINGUARD_PUSH_PIN,false)
            this.pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
            this.pushChainInput.glitchFilter(300000)
            this.pushLevel = 1
        }
        
        return ChainGuard.instance
    }

    clampChain() {
        console.log('Clamping chain')
        return new Promise((resolve,reject) => {
            resolve(this.clampRelay.toggleOn())
        }) 
    }

    releaseChain() {
        console.log('Releasing chain')
        return new Promise((resolve,reject) => {
            resolve(this.clampRelay.toggleOff())
        })
    }

    pushChain() {
        console.log('Pushing chain')
        return new Promise((resolve, reject) => {
            this.pushRelay.toggleOn()
            this.pushChainInput.on('alert', async (level, input) => {
                console.log(level)
                if(level === 1) {
                    await this.moveBackPusher()
                    resolve(this.pushChainInput.removeAllListeners('alert'))
                }
            })
        })
    }

    moveBackPusher() {
        console.log('Moving back pusher')
        return new Promise((resolve, reject) => {
            this.pushRelay.toggleOff()
            this.pushChainInput.on('alert', (level, input) => {
                if(level === 0) {
                    resolve(level)
                }
            })
        })
    }

    isPushed() {
        return this.pushRelay.isToggledOn()
    }

    isClamped() {
        return this.clampRelay.isToggledOn()
    }
}
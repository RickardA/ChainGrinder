const Relay = require('./Relay')

module.exports = class ChainGuard{

    constructor() {
        this.clampRelay = new Relay(process.env.CHAINGUARD_CLAMP_PIN,false)
        this.pushRelay = new Relay(process.env.CHAINGUARD_PUSH_PIN,false)
        this.pushLevel = 1
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
            this.pushChainInput.on('alert', (level, input) => {
                console.log(level)
                if(level === 1) {
                    resolve(this.moveBackPusher())
                }
            })
        })
    }

    moveBackPusher() {
        console.log('Moving back pusher')
        return new Promise((resolve, reject) => {
            this.pushRelay.toggleOff()
            this.pushChainInput.on('alert', (level, input) => {
                console.log(level)
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
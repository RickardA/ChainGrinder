const Relay = require('./Relay')

module.exports = class ChainGuard{

    constructor() {
        this.clampRelay = new Relay(process.env.CHAINGUARD_CLAMP_PIN,false)
        this.pushRelay = new Relay(process.env.CHAINGUARD_PUSH_PIN,false)
        this.isChainPusherOrigin =  true
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
            setTimeout( async () => {
                await this.moveBackPusher()
                resolve('Done pushing chain')
            },2000)
        })
    }

    moveBackPusher() {
        console.log('Moving back pusher')
        return new Promise((resolve, reject) => {
            resolve(this.pushRelay.toggleOff())
        })
    }

    isPushed() {
        return this.pushRelay.isToggledOn()
    }
}
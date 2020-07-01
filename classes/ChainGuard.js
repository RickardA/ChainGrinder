const Relay = require('./Relay')

module.exports = class ChainGuard{

    constructor() {
        this.clampRelay = new Relay(process.env.CHAINGUARD_CLAMP_PIN,false)
        this.pushRelay = new Relay(process.env.CHAINGUARD_PUSH_PIN,false)
    }

    clampChain() {
        this.clampRelay.toggleOn()
    }

    releaseChain() {
        this.clampRelay.toggleOff()
    }

    pushChain() {
        this.pushRelay.toggleOn()
        setTimeout(() => {
            this.moveBackPusher()
        },2000)
    }

    moveBackPusher() {
        this.pushRelay.toggleOff()
    }

    isPushed() {
        return this.pushRelay.isToggledOn()
    }
}
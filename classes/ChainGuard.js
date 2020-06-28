const Relay = require("./relay")

const Relay = require('./Relay')

module.exports = class ChainGuard {

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
    }
}
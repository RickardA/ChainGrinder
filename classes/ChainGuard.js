const Relay = require('./Relay')
const Gpio = require('pigpio').Gpio
const globals = require('../globals')

module.exports = class ChainGuard{

    constructor() {
        if(!ChainGuard.instance) {
            this.clampRelay = new Relay(process.env.CHAINGUARD_CLAMP_PIN,false)
            this.pushRelay = new Relay(process.env.CHAINGUARD_PUSH_PIN,false)
            this.moveRelay = new Relay(process.env.CHAINGUARD_MOVE_PIN,false)
            this.pushChainInput = new Gpio((process.env.CHAINGUARD_PUSH_INPUT_PIN >> 0),{mode: Gpio.INPUT, alert: true})
            this.pushChainInput.glitchFilter(10000)
            this.stop()
        }
        
        return ChainGuard.instance
    } 
    
    stop(){
		this.pushRelay.toggleOff()
        this.clampRelay.toggleOff()
        this.moveRelay.toggleOff()
	}

    clampChain() {
        console.log('Clamping chain')
        return new Promise((resolve,reject) => {
            this.clampRelay.toggleOn()
            resolve(globals.setChainClamped(true))
        }) 
    }

    releaseChain() {
        console.log('Releasing chain')
        return new Promise((resolve,reject) => {
            this.clampRelay.toggleOff()
            resolve(globals.setChainClamped(false))
        })
    }
    
    swingChain() {
		return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.moveRelay.toggleOn()
                resolve(globals.setLenghtGrinderActiveState(true))
            }, 4000)
            setTimeout(() => {
                this.moveRelay.toggleOff()
                resolve(globals.setLenghtGrinderActiveState(false))
            }, 4900)
        })
    }
    
    checkLengthGrinding() {
        return new Promise((resolve, reject) => {
            this.moveRelay.toggleOn()
            resolve(globals.setLenghtGrinderActiveState(true))
        })
    }

    quitCheckLengthGrinding() {
        return new Promise((resolve, reject) => {
            this.moveRelay.toggleOff()
            resolve(globals.setLenghtGrinderActiveState(false))
        })
    }

    pushChain() {
        console.log('Pushing chain')
        return new Promise((resolve, reject) => {
            this.pushRelay.toggleOn()
            globals.setChainPusherState(true)
            this.pushChainInput.on('alert', async (level, input) => {
                console.log(level)
                if(level === 1) {
					setTimeout(async () => {
						await this.moveBackPusher()
						resolve(this.pushChainInput.removeAllListeners('alert'))
					}, 2000)
                    
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
                    globals.setChainPusherState(false)
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

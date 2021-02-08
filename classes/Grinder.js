const Relay = require('./Relay')
const Gpio = require('pigpio').Gpio
const globals = require('../globals')

module.exports = class Grinder {

    constructor() {
        if(!Grinder.instance) {
            this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
            this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
            this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)
            console.log('Input pin: ',process.env.GRINDER_LOWERED_INPUT)
            this.grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT >> 0,{mode: Gpio.INPUT, alert: true})
            this.grinderInput.glitchFilter(10000)
            this.liftTimerIsStarted = false
            this.isAtOrigin = true
            this.stop()
        }
        return Grinder.instance
    }
    
    stop() {
		this.lift()
        this.turnOff()
	}

    turnOn() {
        console.log('Starting grinder')
        return new Promise((resolve, reject) => {
            if (!this.motorRelay.isToggledOn()) {
                this.motorRelay.toggleOn()
                globals.setGrinderOn(true)
                setTimeout(() => { resolve('Grinder on')},5000)
            } else {
                resolve('Grinder already on')
            }
            
        })
    }

    turnOff() {
        console.log('Stopping grinder')
        return new Promise((resolve, reject) => {
            this.motorRelay.toggleOff()
            globals.setGrinderOn(false)
            resolve(globals.setGrinderOn(false))
        })
    }

    lower() {
        console.log('Lowering Grinder')
        return new Promise((resolve, reject) => {
			console.log('Inside promise')
            this.grinderInput.on('alert', (level, input) => {
                console.log('grinderLevel lower ', level)
                 if (level == 1) {
                     globals.setGrinderLowered(true)
                     resolve(this.grinderInput.removeAllListeners('alert'))
                 }
             })
             this.liftRelay.toggleOn()
        })
    }
    
    manualLower() {
		this.liftRelay.toggleOn()
		globals.setGrinderLowered(true)
	}

    lift() {
        console.log('Lifting grinder')
        return new Promise((resolve, reject) => {
            this.liftRelay.toggleOff()
            this.grinderInput.on('alert', (level, input) => {
                console.log('grinderLevel lift', level,)
                 if (level == 0) {
                    globals.setGrinderLowered(false)
                    resolve(this.grinderInput.removeAllListeners('alert'))
                 }
             })
        })
    }
    
    manualLift() {
		this.liftRelay.toggleOff()
		globals.setGrinderLowered(false)
	}

    isLowered() {
        return this.liftRelay.isToggledOn()
    }

    alterAngle() {
        console.log('altering grinder angle')
        return new Promise((resolve, reject) => {
            if (this.angleRelay.isToggledOn()) {
                this.angleRelay.toggleOff()
                resolve(globals.setAngleAltered(false))
            } else {
                this.angleRelay.toggleOn()
                resolve(globals.setAngleAltered(true))
            }
        })
    }

    startLiftTimer() {
        console.log('Starting lift timer')
        return new Promise((resolve, reject) => {
            this.liftTimerIsStarted = true
            setTimeout(() => {
                this.liftTimerIsStarted = false
                resolve(this.lift())
            }, 5000)
        })
        
    }

}

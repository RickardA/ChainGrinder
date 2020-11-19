const Relay = require('./Relay')
const Gpio = require('pigpio').Gpio

module.exports = class Grinder {

    constructor() {
        if(!Grinder.instance) {
            this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
            this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
            this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)
            console.log('Input pin: ',process.env.GRINDER_LOWERED_INPUT)
            this.grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT >> 0,{mode: Gpio.INPUT, alert: true})
            this.grinderInput.on('alert', (level, input) => {
                console.log('grinderLevel ', level,)
             })

            this.grinderInput.glitchFilter(10000)
            this.liftTimerIsStarted = false
            this.isAtOrigin = true
        }
        return Grinder.instance
    }

    turnOn() {
        console.log('Starting grinder')
        return new Promise((resolve, reject) => {
            if (!this.motorRelay.isToggledOn()) {
                this.motorRelay.toggleOn()
                setTimeout(() => { resolve('Grinder on')},5000)
            } else {
                resolve('Grinder already on')
            }
            
        })
    }

    turnOff() {
        console.log('Stopping grinder')
        return new Promise((resolve, reject) => {
            resolve(this.motorRelay.toggleOff())
        })
    }

    lower() {
        console.log('Lowering Grinder')
        return new Promise((resolve, reject) => {
            this.liftRelay.toggleOn()
            this.grinderInput.on('alert', (level, input) => {
                console.log('grinderLevel ', level,)
                 if (level == 1) {
                     resolve(this.grinderInput.removeAllListeners('alert'))
                 }
             })
        })
    }

    lift() {
        console.log('Lifting grinder')
        return new Promise((resolve, reject) => {
            this.liftRelay.toggleOff()
            this.grinderInput.on('alert', (level, input) => {
                console.log('grinderLevel ', level,)
                 if (level == 0) {
                    resolve(this.grinderInput.removeAllListeners('alert'))
                 }
             })
        })
    }

    isLowered() {
        return this.liftRelay.isToggledOn()
    }

    alterAngle() {
        console.log('altering grinder angle')
        return new Promise((resolve, reject) => {
            if (this.angleRelay.isToggledOn()) {
                resolve(this.angleRelay.toggleOff())
            } else {
                resolve(this.angleRelay.toggleOn())
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

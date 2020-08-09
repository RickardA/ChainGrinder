const Relay = require('./Relay')

module.exports = class Grinder {

    constructor() {
        this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
        this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
        this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)

        this.liftTimerIsStarted = false
        this.isAtOrigin = true
    }

    turnOn() {
        console.log('Starting grinder')
        return new Promise((resolve, reject) => {
            this.motorRelay.toggleOn()
            setTimeout(() => { resolve('Grinder on')},5000)
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
                     resolve(level)
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
                     resolve(level)
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
            }, 10000)
        })
        
    }

}
const Relay = require('./Relay')

module.exports = class Grinder {

    constructor() {
        this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
        this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
        this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)

        this.liftTimerIsStarted = false
    }

    turnOn() {
        console.log('Starting grinder')
        return new Promise((resolve, reject) => [
            resolve(this.motorRelay.toggleOn())
        ])
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
            resolve(this.liftRelay.toggleOn())
        })
    }

    lift() {
        console.log('Lifting grinder')
        return new Promise((resolve, reject) => {
            resolve(this.liftRelay.toggleOff())
        })
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
        this.liftTimerIsStarted = true
        setTimeout(() => {
            this.liftRelay.toggleOff()
            this.liftTimerIsStarted = false
        }, 10000)
    }

}
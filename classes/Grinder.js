const Relay = require('./Relay')

module.exports = class Grinder {

    constructor() {
        this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
        this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
        this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)

        this.liftTimerIsStarted = false
    }

    turnOn() {
        return new Promise((resolve, reject) => [
            resolve(this.motorRelay.toggleOn())
        ])
    }

    turnOff() {
        return new Promise((resolve, reject) => {
            resolve(this.motorRelay.toggleOff())
        })
    }

    lower() {
        return new Promise((resolve, reject) => {
            resolve(this.liftRelay.toggleOn())
        })
    }

    lift() {
        return new Promise((resolve, reject) => {
            resolve(this.liftRelay.toggleOff())
        })
    }

    alterAngle() {
        return new Promise((resolve, reject) => {
            if (this.angleRelay.isToggledOn()) {
                resolve(this.angleRelay.toggleOff())
            } else {
                resolve(this.angleRelay.toggleOn())
            }
        })
    }

    startLiftTimer() {
        this.liftTimerIsStarted = true
        setTimeout(() => {
            this.liftRelay.toggleOff()
            this.liftTimerIsStarted = false
        }, 10000)
    }

}
const Relay = require('./Relay')

module.exports = class Grinder {

    constructor() {
        this.motorRelay = new Relay(process.env.GRINDER_MOTOR_PIN,false)
        this.liftRelay = new Relay(process.env.GRINDER_LIFT_PIN,false)
        this.angleRelay = new Relay(process.env.GRINDER_ANGLE_PIN,false)
    }

    turnOn() {
        this.motorRelay.toggleOn()
    }

    turnOf() {
        this.motorRelay.toggleOff()
    }

    lower() {
        this.liftRelay.toggleOn()
    }

    lift() {
        this.liftRelay.toggleOff()
    }

    alterAngle() {
        if (this.angleRelay.isToggledOn()) {
            this.angleRelay.toggleOff()
        } else {
            this.angleRelay.toggleOn()
        }
    }

}
const Gpio = require('pigpio').Gpio
const EventEmitter = require('events')

module.exports = class Relay extends EventEmitter {

    constructor(pin, isInverted) {
        super()
        this.pin = pin
        this.isInverted = isInverted

        this.relay = new Gpio(pin >> 0,Gpio.OUTPUT)
    }

    toggleOn() {
        this.relay.digitalWrite(this.isInverted ? 0 : 1)
    }

    toggleOff() {
        this.relay.digitalWrite(this.isInverted ? 1 : 0)
    }

    isToggledOn() {
        if (this.isInverted) {
            return this.relay.digitalRead() == 1 ? false : true
        } else {
            return this.relay.digitalRead() == 1 ? true : false
        }
    }
}
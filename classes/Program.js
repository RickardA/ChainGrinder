const Grinder = require('./classes/Grinder')
const ChainGuard = require('./classes/ChainGuard')
const Relay = require('./classes/Relay')
const Gpio = require('pigpio').Gpio

module.exports = class Program {

    constructor() {
        if(! Program.instance) {
            
        }
    }
}
const grinder = new Grinder()
const chainGuard = new ChainGuard()

const pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
const grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT,{mode: Gpio.INPUT, alert: true})
//const magic = new Relay(19,false)
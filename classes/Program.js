const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const EventEmitter = require('events')

module.exports = class Program extends EventEmitter {

    constructor() {
        if(! Program.instance) {
            super()
            Program.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            
        }
        return Program.instance
    }

    async startProgram() {
        let teethCounter = 0
        do {
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            await this.grinder.lower()
            await this.grinder.startLiftTimer()
            await this.chainGuard.releaseChain()
            console.log('One iteration done')
            teethCounter += 1
        } while(teethCounter != 5) 
        
        await this.grinder.turnOff()

        this.emit('done', true)
    }
}
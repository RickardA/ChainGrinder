const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const EventEmitter = require('events')
const { getTotalTooths, setToothsLeft, setStatus, getStatus, getToothsLeft } = require('../globals')
const MyEmitter = require('./MyEvent')


module.exports = class Program extends EventEmitter {

    constructor() {
        if(! Program.instance) {
            super()
            Program.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            this.myEmitter = new MyEmitter()
            
        }
        return Program.instance
    }

    async startProgram() {
        setToothsLeft(getTotalTooths())
        setStatus('GRINDING')
        console.log('Tooths left: ', getToothsLeft())
        console.log('Total tooths: ', getTotalTooths())
        console.log('Status: ', getStatus())
        someLoop: do{
			this.myEmitter.on('STOP', function() {
				console.log('STOP')
				break someLoop
			})
			//break someLoop
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            await this.grinder.lower()
            await this.grinder.startLiftTimer()
            await this.chainGuard.releaseChain()
            console.log('One iteration done')
            setToothsLeft(getToothsLeft() + 1)
        }while(getToothsLeft() != getTotalTooths() && getStatus() !== 'STOP')
        
        await this.grinder.turnOff()
		
		setStatus('RESTING')
        this.emit('done', true)
    }
}

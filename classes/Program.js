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
            this.chainGuard.releaseChain()
            this.grinder.lift()
            this.myEmitter = new MyEmitter()
            this.interval
            
        }
        return Program.instance
    }

    async startProgram() {
        setToothsLeft(getTotalTooths())
        setStatus('GRINDING')
        console.log('Tooths left: ', getToothsLeft())
        console.log('Total tooths: ', getTotalTooths())
        console.log('Status: ', getStatus())
		aLoop: do{
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            if(getStatus() === 'STOP') break
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            if(getStatus() === 'STOP') break
            await this.grinder.lower()
            if(getStatus() === 'STOP') break
            await this.grinder.startLiftTimer()
            if(getStatus() === 'STOP') break
            await this.chainGuard.releaseChain()
            if(getStatus() === 'STOP') break
            console.log('One iteration done')
            setToothsLeft(getToothsLeft() - 1)
            console.log('Tooths left: ', getToothsLeft())
			console.log('Total tooths: ', getTotalTooths())
            if(getStatus() === 'STOP') break
        }while(getToothsLeft() !== 0 && getStatus() !== 'STOP')
        
        await this.grinder.lift()
        await this.grinder.turnOff()
		await this.grinder.releaseChain()
        
        setStatus('RESTING')
        this.emit('done', true)
    }
}

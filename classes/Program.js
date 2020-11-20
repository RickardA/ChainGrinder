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
            this.interval
            
            this.setupSequenceIsRunning = false

            this.checkAndSetSequence()
            
        }
        return Program.instance
    }
    
    exit() {
		this.grinder.stop()
		this.chainGuard.stop()
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
        
        this.grinder.stop()
        this.chainGuard.stop()
        
        setStatus('RESTING')
        this.emit('done', true)
    }

    checkAndSetSequence() {
        if(this.chainGuard.isClamped() || this.grinder.isLowered()) {
            this.setupSequenceIsRunning = true
        }
    }

    alterGrinderAngle() {
        setStatus('ALTERING ANGLE')
        this.grinder.alterAngle()
        setStatus('RESTING')
    }

    async liftGrinder() {
        setStatus('LIFTING')
        await this.grinder.lift()
        setStatus('RESTING')
    }

    async lowerGrinder() {
        setStatus('LOWERING')
        console.log('LOWERING GRINDER')
        await this.grinder.lower()
        console.log('GINDER LOWERED, RESTING')
        setStatus('RESTING')
    }

    async runSetupSequence() {
        console.log('Running setup sequence...')
        if(!this.setupSequenceIsRunning) {
            setStatus('SETUP')
            this.setupSequenceIsRunning = true
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            await this.grinder.lower()
            console.log('Setup sequence done')
            setStatus('SETUPSTARTED')
        } else {
            await this.stopSetupSequence()
            this.setupSequenceIsRunning = false
            setStatus('RESTING')
        }
    }

    async stopSetupSequence() {
        console.log('Stopping setup sequence...')
        await this.grinder.lift()
        await Promise.all([this.grinder.turnOff(), this.chainGuard.releaseChain()])
        console.log('Setup sequence stopped')
        this.emit('setupStopped',true)
    }
}

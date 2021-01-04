const Grinder = require('./Grinder')
const ChainGuard = require('./ChainGuard')
const EventEmitter = require('events')
const { getTotalTooths, setToothsLeft, setStatus, getStatus, getToothsLeft } = require('../globals')
const MyEmitter = require('./MyEvent')
const Relay = require('./Relay')


module.exports = class Program extends EventEmitter {

    constructor() {
        if(! Program.instance) {
            super()
            Program.instance = this
            this.grinder = new Grinder()
            this.chainGuard = new ChainGuard()
            this.myEmitter = new MyEmitter()
            this.interval
            this.summer = new Relay(process.env.SUMMER,false)
            
            this.summer.toggleOff()
            
            this.setupSequenceIsRunning = false

            this.checkAndSetSequence()
            
        }
        return Program.instance
    }
    
    exit() {
		this.grinder.stop()
		this.chainGuard.stop()
		this.summer.toggleOff()
	}

    async startProgram() {
        this.grinder.stop()
        this.chainGuard.stop()
        setToothsLeft(getTotalTooths())
        setStatus('GRINDING')
        setActiveThing('GRINDING')
		aLoop: do{
            await Promise.all([this.grinder.alterAngle(), this.chainGuard.pushChain()])
            if(getStatus() === 'STOP') break
            await Promise.all([this.chainGuard.clampChain(), this.grinder.turnOn()])
            if(getStatus() === 'STOP') break
            await this.grinder.lower()
            if(getStatus() === 'STOP') break
            await Promise.all([this.grinder.startLiftTimer(), this.chainGuard.swingChain()])
            if(getStatus() === 'STOP') break
            await this.chainGuard.releaseChain()
            if(getStatus() === 'STOP') break
            setToothsLeft(getToothsLeft() - 1)
            if(getStatus() === 'STOP') break
        }while(getToothsLeft() !== 0 && getStatus() !== 'STOP')
        
        this.summer.toggleOn()
        
        setTimeout(() => {
			this.summer.toggleOff()
		},5000)
        
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
        await this.grinder.lower()
        setStatus('RESTING')
    }

    async startGrinder() {
        setStatus('STARTINGGRIDNER')
        await this.grinder.turnOn()
        setStatus('RESTING')
    }

    async stopGrinder() {
        setStatus('STOPPINGGRIDNER')
        await this.grinder.turnOff()
        setStatus('RESTING')
    }

    async pushChain() {
        setStatus('PUSHINGCHAIN')
        await this.chainGuard.pushChain()
        setStatus('RESTING')
    }

    async clampChain() {
        setStatus('CLAMPINGCHAIN')
        await this.chainGuard.clampChain()
        setStatus('RESTING')
    }

    async releaseChain() {
        setStatus('RELEASINGCHAIN')
        await this.chainGuard(this.releaseChain())
        setStatus('RELEASE')
    }

    async checkLengthGrinding() {
        setStatus('CHECKINGLENGTHGRINDING')
        await this.chainGuard.checkLengthGrinding()
        setStatus('RESTING')
    }

    async quitCheckLengthGrinding() {
        setStatus('QUITCHECKLENGTHGRINDING')
        await this.chainGuard.quitCheckLengthGrinding()
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

const EventEmitter = require('events')

module.exports = class MyEvent extends EventEmitter {

		constructor() {
			if(!MyEvent.instance) {
				super()
				MyEvent.instance = this
			}

			return MyEvent.instance
		}
		
		emitEvent(event) {
			this.emit(event)
		}

}

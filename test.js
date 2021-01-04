const {getState, setState} = require('./globals')

setState({grinder: {status: 'Test' }})

console.log(getState())
const math = require('./math')
const app = require('./app')

// Set all module functions to jest.fn
jest.mock('./math.js')

// The only disadvantage of this strategy is that it’s difficult to
// access the original implementation of the module.
// For those use cases, you can use spyOn.

test('calls math.add', () => {
	console.log(app.doAdd(1, 2))
	expect(math.add).toHaveBeenCalledWith(1, 2)
})

test('calls math.subtract', () => {
	console.log(app.doSubtract(1, 2))
	expect(math.subtract).toHaveBeenCalledWith(1, 2)
})

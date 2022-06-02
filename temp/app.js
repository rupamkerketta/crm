const math = require('./math')

exports.doAdd = (a, b) => math.add(a, b)
exports.doSubtract = (a, b) => math.subtract(a, b)
exports.doMultiply = (a, b) => math.multiply(a, b)
exports.doDivide = (a, b) => math.divide(a, b)

function guardIsFunction(value) {
    if (!typeof value === 'function')
        throw new Error('Value is null or not a function');
}

module.exports = {
    guardIsFunction
};
const utilities = require("../utilities/")

errorCont = {}

errorCont.buildInternalServerError = async (req, res, next) => {
    throw new Error()
}

module.exports = errorCont
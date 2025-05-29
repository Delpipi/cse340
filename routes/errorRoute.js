//Need Resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")

const errorController = require("../controllers/errorController")

router.get("/500", utilities.handleErrors(errorController.buildInternalServerError));

module.exports = router;
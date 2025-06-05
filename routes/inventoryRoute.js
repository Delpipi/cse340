//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")

const invController = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/vehicle", utilities.handleErrors(invController.buildAddInventory));
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryItemDetails));

module.exports = router;
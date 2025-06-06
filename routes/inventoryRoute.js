//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")

const invController = require("../controllers/invController")
const classValidate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/vehicle", utilities.handleErrors(invController.buildAddInventory));
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryItemDetails));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.post("/classification",
    classValidate.classRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);
router.post("/vehicle",
    classValidate.vehicleRules(),
    classValidate.checkVehiculeData,
    utilities.handleErrors(invController.addVehicle)
);


module.exports = router;
//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/vehicle", utilities.handleErrors(invController.buildAddInventory));
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryItemDetails));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory));

router.post("/classification",
    invValidate.classAddRules(),
    invValidate.checkClassAddData,
    utilities.handleErrors(invController.addClassification)
);
router.post("/vehicle",
    invValidate.invAddRules(),
    invValidate.checkInvAddData,
    utilities.handleErrors(invController.addInventory)
);

router.post("/update",
    invValidate.invAddRules(),
    invValidate.checkInvUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
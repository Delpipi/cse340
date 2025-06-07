//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

/***************************
* Other Routes 
****************************/

//GET inventory List By classification_Id
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//GET inventories in JSON format By classificationId
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//GET Management view
router.get("/", utilities.handleErrors(invController.buildManagement));


/***************************
* Classification Routes 
****************************/

//GET Add classification view
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
//Add classification
router.post("/classification",
    invValidate.classAddRules(),
    invValidate.checkClassAddData,
    utilities.handleErrors(invController.addClassification)
);


/***************************
* Inventory Routes 
****************************/

//Get Add item view
router.get("/item", utilities.handleErrors(invController.buildAddInventory));
//Add Inventory
router.post("/item",
    invValidate.invAddRules(),
    invValidate.checkInvAddData,
    utilities.handleErrors(invController.addInventory)
);


//GET Edit inventory view
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory));
//Edit Inventory
router.post("/update",
    invValidate.invAddRules(),
    invValidate.checkInvUpdateData,
    utilities.handleErrors(invController.updateInventory)
);


//GET Delete inventory view
router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildDeleteInventory));
//Delete Inventory
router.post("/delete",
    utilities.handleErrors(invController.deleteInventory)
);


//GET Detail inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryItemDetails));


module.exports = router;
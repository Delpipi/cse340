const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", { title: className + " vehicles" , smallCssFile: "classification.css", largeCssFile: "classification-large.css", nav, grid})
}

/* ***************************
 *  Build inventory item details view
 * ************************** */
invCont.buildInventoryItemDetails = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const vehicle = await invModel.getInventoryItemDetails(inventory_id)
    const grid = await utilities.buildInventoryItemDetailsGrid(vehicle)
    let nav = await utilities.getNav()
    res.render("./inventory/inventory-item-details",
        {
            title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
            smallCssFile: "inventory-item-details.css",
            largeCssFile: "inventory-item-details-large.css",
            nav,
            grid
        }
    )
}

invCont.buildManagement = async (req, res, next) => {
    const nav = await utilities.getNav()
    res.render("./inventory/management",
        {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            nav,
        }
    )
}

invCont.buildAddClassification = async (req, res, next) => {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification",
        {
            title: "Add New Classification",
            smallCssFile: "classification.css",
            largeCssFile: "classification-large.css",
            nav,
            errors: null
        }
    )
}

invCont.buildAddInventory = async (req, res, next) => {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory",
        {
            title: "Add New Vehicle",
            smallCssFile: "inventory.css",
            largeCssFile: "inventory-large.css",
            nav,
            classificationList,
            errors: null
        }
    )
}

module.exports = invCont
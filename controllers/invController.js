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

/* *******************************
 *  Build inventory item details view
 * ******************************/
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

/* *******************************
 *  Build manageement view
 * ******************************/
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

/* *******************************
 * Build add new classification view
 * ******************************/
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

/* *******************************
 * Build add new vehicle view
 * ******************************/
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

/* *******************************
 * Add new classification
 * ******************************/
invCont.addClassification = async (req, res, next) => {
    const nav = utilities.getNav()

    const { classification_name } = req.body

    const classResult = await invModel.addClassification(classification_name)

    if (classResult) {
        req.flash("notice",
            `A new classification ${classification_name} is added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            nav,
        })
    } else {
        req.flash("notice",
            "Sorry, Add new classification failed"
        )
        res.status(501).render("./inventory/add-classification",
            {
                title: "Add New Classification",
                smallCssFile: "classification.css",
                largeCssFile: "classification-large.css",
                nav,
                errors: null
            }
        )
    }
}

/* *******************************
 * Add new vehicle
 * ******************************/
invCont.addVehicle = async (req, res, next) => {
    const nav = utilities.getNav()

    const { inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    } = req.body

    const vehicleResult = await invModel.addVehicle(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (vehicleResult) {
        req.flash("notice",
            `A new vehicle Make: ${inv_make} and Model: ${inv_model} is added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            nav,
        })
    } else {
        req.flash("notice",
            "Sorry, Add new vehicle failed"
        )
        const classificationList = await utilities.buildClassificationList()
        res.status(501).render("./inventory/add-inventory",
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
}

module.exports = invCont
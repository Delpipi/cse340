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
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management",
        {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            classificationList,
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
invCont.addInventory = async (req, res, next) => {
    const nav = utilities.getNav()

    const { inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    } = req.body

    const addResult = await invModel.addInventory(
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

    if (addResult) {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* *******************************
 * Build update inventory view
 * ******************************/
invCont.buildEditInventory = async (req, res, next) => {
    const inventory_id = parseInt(req.params.inventory_id) 
    let nav = await utilities.getNav()
    const invData = await invModel.getInventoryItemDetails(inventory_id)
    const classificationSelect = await utilities.buildClassificationList(invData.classification_id)
    const name = `${invData.inv_make} ${invData.inv_model}`
    if (invData) {
        res.render("./inventory/edit-inventory",
            {
                title: "Edit " + name,
                smallCssFile: "inventory.css",
                largeCssFile: "inventory-large.css",
                nav,
                classificationList: classificationSelect,
                inv_id: invData.inv_id,
                inv_make: invData.inv_make,
                inv_model: invData.inv_model,
                inv_year: invData.inv_year,
                inv_description: invData.inv_description,
                inv_image: invData.inv_image,
                inv_thumbnail: invData.inv_thumbnail,
                inv_price: invData.inv_price,
                inv_miles: invData.inv_miles,
                inv_color: invData.inv_color,
                errors: null
            }
        )
    }
}

/* *******************************
 * Build delete inventory view
 * ******************************/
invCont.buildDeleteInventory = async (req, res, next) => {
    const inventory_id = parseInt(req.params.inventory_id) 
    let nav = await utilities.getNav()
    const invData = await invModel.getInventoryItemDetails(inventory_id)
    if (invData) {
        res.render("./inventory/delete-inventory",
            {
                title: "Delete " + invData.inv_model,
                smallCssFile: "inventory.css",
                largeCssFile: "inventory-large.css",
                nav,
                inv_id: invData.inv_id,
                inv_make: invData.inv_make,
                inv_model: invData.inv_model,
                inv_year: invData.inv_year,
                inv_price: invData.inv_price,
                errors: null
            }
        )
    }
}


/* *******************************
 * Update inventory process
 * ******************************/
invCont.updateInventory = async (req, res, next) => {
    const nav = await utilities.getNav()

    const {inv_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
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

    if (updateResult) {
        req.flash("notice",
            `${inv_make} ${inv_model} was successfull updated.`
        )
        const classificationList = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            nav,
            classificationList,
        })
    } else {
        req.flash("notice",
            `Sorry, ${name} modification has failed`
        )
        const classificationSelect = await utilities.buildClassificationList(inv_id)
         const name= `${inv_make} ${inv_model}`
        res.render("./inventory/edit-inventory",
            {
                title: "Edit " + name,
                smallCssFile: "inventory.css",
                largeCssFile: "inventory-large.css",
                nav,
                classificationList: classificationSelect,
                inv_id: invData.inv_id,
                inv_make: invData.inv_make,
                inv_model: invData.inv_model,
                inv_year: invData.inv_year,
                inv_description: invData.inv_description,
                inv_image: invData.inv_image,
                inv_thumbnail: invData.inv_thumbnail,
                inv_price: invData.inv_price,
                inv_miles: invData.inv_miles,
                inv_color: invData.inv_color,
                errors: null
            }
        )
    }
}

/* *******************************
 * Delete inventory process
 * ******************************/
invCont.deleteInventory = async (req, res, next) => {
    const nav = await utilities.getNav()
    const {inv_id, inv_make, inv_model, inv_year, inv_price} = req.body

    const data = await invModel.deleteInventory(inv_id)

    if (data) {
        req.flash("notice",
            `The deletion was successfull updated.`
        )
        const classificationList = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            smallCssFile: "management.css",
            largeCssFile: "management-large.css",
            nav,
            classificationList,
        })
    } else {
        req.flash("notice",
            `Sorry, The delete failed`
        )
        res.render("./inventory/delete-inventory",
            {
                title: "Delete " + inv_model,
                smallCssFile: "inventory.css",
                largeCssFile: "inventory-large.css",
                nav,
                inv_id: inv_id,
                inv_make: inv_make,
                inv_model: inv_model,
                inv_year: inv_year,
                inv_price: inv_price,
                errors: null
            }
        )
    }
}

module.exports = invCont
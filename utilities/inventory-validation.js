//Need Resources
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*****************************************
*  Add classification Data Validation Rules
***************************************/
validate.classRules = () => {
    return [
        // classification_name is required and must be 
        // between 3 and 5 characters long
        body("classification_name")
            .trim()
            .notEmpty().withMessage("Name is required")
            .isAlpha().withMessage("Alphabetic character only")
            .isLength({ min: 3, max: 5 }).withMessage("Between 3 and 5 characters long")
    ]
}

/***************************************
 * Check classification name and return errors 
 * or return to management view
 **************************************/
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = utilities.getNav()
        res.render("./inventory/add-classification",
            {
                title: "Add New Classification",
                smallCssFile: "classification.css",
                largeCssFile: "classification-large.css",
                nav,
                classification_name,
                errors: errors
            }
        )
        return
    }
    next()
}

/***********************************
*  Vehicle Data Validation Rules
************************************/
validate.vehicleRules = () => {
    return [
        // classification_name is required and must be 
        // between 3 and 5 characters long
        body("classification_id")
            .trim()
            .notEmpty().withMessage("Classifiction name is required")
            .isInt().withMessage("Invalid Classifiction selected"),
        
        // Make is required and must be at least 3 characters
        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make is required.")
            .isString()
            .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
        
        // Make is required and must be at least 3 characters
        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required.")
            .isString()
            .isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
        
        // Description is required
        body("inv_description")
          .trim()
            .notEmpty().withMessage("Description is required."),
        
        // Image path is required
        body("inv_image")
            .trim()
            .notEmpty().withMessage("Image path is required."),
        
        // Thumbnail is required
        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("Thumbnail path is required."),
        
        
        // Price is required and must be an integer or decimal.
        body("inv_price")
            .trim()
            .notEmpty().withMessage("Price is required.")
            .custom(value => {
                if (!/^\d+(\.\d{2})?$/.test(value)) {
                    throw new Error("Price must be an integer or decimal.")
                }
                return true
            }),
        
         // Year is required with 4 digit.
        body("inv_year")
            .trim()
            .notEmpty().withMessage("Year is required.")
            .custom(value => {
                if (!/\d{4}/.test(value)) {
                    throw new Error("Year must be 4-digit year.")
                }
                return true
            }),
        
        // Miles is required and is digit only.
        body("inv_miles")
            .trim()
            .notEmpty().withMessage("Miles is required.")
            .isInt()
            .withMessage("Miles must be digit only"),
        
        // Color is required and alphabetic only.
        body("inv_color")
            .trim()
            .notEmpty().withMessage("Color is required.")
            .isAlpha().withMessage("Color must be alphabetic character only")
    ]
}

/***************************************
 * Check vehicle data and return errors 
 * or redirect to management view
 **************************************/
validate.checkVehiculeData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-inventory",
            {
                title: "Add New Vehicle",
                smallCssFile: "inventory.css",
                largeCssFile: "inventory-large.css",
                nav,
                classificationList,
                inv_make, inv_model, inv_year, inv_description,
                inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
                errors: errors
            }
        )
        return
    }
    next()
}



module.exports = validate
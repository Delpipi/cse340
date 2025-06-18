/*********************************
*  Reservation  Validation
***********************************/

//Need resources
const utilities = require('.')
const { body, validationResult } = require("express-validator")

//Model
const resModel = require('../models/reservation-model')

const validate = {}

/**********************************
*  Add Reservation Validation Rules
***********************************/
validate.addReservationRules = () => {
    return [
        body("account_id")
            .trim()
            .notEmpty().withMessage("Account id is required")
            .isInt().withMessage("Invalid Account id"),
        
        body("inventory_id")
            .trim()
            .notEmpty().withMessage("Inventory id is required")
            .isInt().withMessage("Invalid Inventory id"),
        
        body("inventory_make")
            .trim()
            .notEmpty().withMessage("Make is required.")
            .isString()
            .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
        
        body("inventory_model")
            .trim()
            .notEmpty().withMessage("Model is required.")
            .isString()
            .isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
        
        body("inventory_thumbnail")
            .trim()
            .notEmpty().withMessage("Thumbnail path is required."),
        
        
        body("inventory_price")
            .trim()
            .notEmpty().withMessage("Price is required.")
            .custom(value => {
                if (!/^\d+(\.\d{2})?$/.test(value)) {
                    throw new Error("Price must be an integer or decimal.")
                }
                return true
            }),
        
        body("inventory_qty")
            .trim()
            .notEmpty().withMessage("Quantity is required")
            .isInt().withMessage("Invalid quantity"),
    ]
}

/**********************************
*  Check Add Reservation data
***********************************/
validate.checkAddReservationData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({"errors": errors.array()})
    }
    next()
}

/**********************************
*  Delete Reservation rules
***********************************/
validate.deleteReservationRules = () => {
    return [
        body("res_id")
        .trim()
        .notEmpty().withMessage("Reservation id is required")
        .isInt().withMessage("Invalid Reservation id"),
    ]
}

/**********************************
*  Check deletion Reservation data
***********************************/
validate.checkDeleteReservationData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({"errors": errors.array()})
    }
    next()
}

module.exports = validate
//Need Resources
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    //valid email is required
    return [
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
    
    //Password is required and must be strong
    body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        
        // lastname is required and must be string
        body("account_firstname")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),
        
        // valid  email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),
        
        // password is required and must be strong passowrd
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
     ]
}

/************************************
*  Update Data Validation Rules
*************************************/
validate.updateRules =  async (req, res, next) => {
    let rules = [];
    
    if (req.body.action === 'update-password') {
        rules = [
            body("account_password")
                .trim()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet requirements.")
        ];
    } else if(req.body.action === 'update-account'){
        rules = [
            body("account_firstname")
                .trim()
                .isString()
                .isLength({ min: 1 })
                .withMessage("Please provide a first name."),
        
            body("account_lastname")  // Fix: this should be "account_lastname" instead of "account_firstname"
                .trim()
                .isString()
                .isLength({ min: 1 })
                .withMessage("Please provide a last name."),
        
            body("account_email")
                .trim()
                .isEmail()
                .normalizeEmail()
                .withMessage("A valid email is required."),
        ];
    }

    await Promise.all(rules.map(rule => rule.run(req)));

    next();
}


/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./account/login", {
            errors,
            title: "Login",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
        })
        return
    }
    next()
}
 
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./account/register", {
            errors,
            title: "Registration",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/********************************
* Check data and return errors or 
* continue to update
******************************* */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        let nav = await utilities.getNav()
        res.render("./account/edit-account", {
            errors,
            title: "Edit Account",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
    }
    next()
}

module.exports = validate
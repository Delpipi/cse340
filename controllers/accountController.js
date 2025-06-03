const utilities = require('../utilities/')
const accountModel = require('../models/account-model')

accountCont = {}

accountCont.buildLogin = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("./account/login",
        {
            title: "Login",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            errors: null 
        })
}

accountCont.buildRegistration = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("./account/register",
        {
            title: "Register",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            errors: null 
        })
}

accountCont.registerAccount = async (req, res) =>{
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you \'re registered ${account_firstname}. Please log in`
        )
        res.status(201).render("./account/login", {
            title: "Login",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("./account/register", {
            title: "Registration",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            errors: null,
        })
    }
}

module.exports = accountCont
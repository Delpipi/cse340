const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")

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

    //Hash the password before storing
    let hashedPassword
    try {
        //regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("error", "Sorry there was error processing registration.")
        res.status(500).render("./account/register", {
            title: "Registration",
            smallCssFile: "account.css",
            largeCssFile: "account-large.css",
            nav,
            errors: null
        })
    }
    
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
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
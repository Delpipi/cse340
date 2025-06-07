const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()

accountCont = {}

/* ****************************************
 *  build login view
 * ************************************ */
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

/* ************************************
 *  Build registration view
 * *************************************/
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

/* **********************************
 *  Build account management view
 * **********************************/
accountCont.buildAccountManagement = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("./account/account",{
        title: "Account Management",
        smallCssFile: "account.css",
        largeCssFile: "account-large.css",
        nav, 
    })
}

/* ****************************************
 *  Process register request
 * ************************************ */
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

/* **************************************
 *  Process login request
 * **************************************/
accountCont.accountLogin = async (req, res) => {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email, account_password)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("./account/login",
            {
                title: "Login",
                smallCssFile: "account.css",
                largeCssFile: "account-large.css",
                nav,
                account_email,
                errors: null 
            })
        return
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_lastname
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        } else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("./account/login",{
                title: "Login",
                smallCssFile: "account.css",
                largeCssFile: "account-large.css",
                nav,
                account_email,
                errors: null 
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* **************************************
 *  Process logout request
 * **************************************/
accountCont.accountLogout = async (req, res, next) => {
    if (req.cookies.jwt) {
        res.clearCookie("jwt")
        res.locals.accountData = {}
        res.locals.loggedin = 0
    }
    return res.redirect("/")
}

module.exports = accountCont
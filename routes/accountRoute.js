/* ***********************
 * Account Route
 *************************/

//Need Resources
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')

const regValidate = require('../utilities/account-validation')
const accountCont = require('../controllers/accountController')

//GET Account management view
router.get('/',
    utilities.checkLogin,
    utilities.handleErrors(accountCont.buildAccountManagement)
)

//Logout Account
router.get('/logout', utilities.handleErrors(accountCont.accountLogout))


//GET login view
router.get('/login', utilities.handleErrors(accountCont.buildLogin))
//Login account
router.post('/login', 
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountCont.accountLogin)
)

//GET Registration Account view
router.get('/register', utilities.handleErrors(accountCont.buildRegistration))
//Register account
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountCont.registerAccount)
)

//GET Edit Account view
router.get('/update/:account_id',utilities.checkLogin,utilities.handleErrors(accountCont.buildEditAccount))
//Update account
router.post('/update/:account_id',
    utilities.checkEmail,
    regValidate.updateRules,
    regValidate.checkUpdateData,
    (req, res, next) => {
        const { action } = req.body;
        if (action === 'update-account') {
            utilities.handleErrors(accountCont.updateAccount)(req, res, next)
        } else if (action === 'update-password') {
            utilities.handleErrors(accountCont.updatePasswordAccount)(req, res, next)
        } else {
            throw new Error("");
        }
    }
)

module.exports = router


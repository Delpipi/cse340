const utilities = require("../utilities/")

accountCont = {}

accountCont.buildLogin = async (req, res, next) => {
    let nav = await utilities.getNav()
    let grid = await utilities.buildLoginGrid()
    res.render("./account/login", { title: "Login" , smallCssFile: "login.css", largeCssFile: "login-large.css", nav, grid})
}

module.exports = accountCont
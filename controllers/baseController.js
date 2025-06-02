const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("index", { title: "Home" , smallCssFile: "home.css", largeCssFile: "home-large.css", nav})
}

module.exports = baseController
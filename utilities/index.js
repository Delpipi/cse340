const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list+= '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of '
            + row.classification_name + ' vehicles">'
            + row.classification_name + '</a>'
        list+="</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async (data) => {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' details"> <img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr/>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' details"> ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the inventory item details view HTML
* ************************************ */
Util.buildInventoryItemDetailsGrid = async function name(vehicle) {
    let grid
   
        grid = '<div class="details">'
        grid += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + '" loading="lazy">'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
        grid += '<p class="price">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
        grid += '<p class="desc"><b>Description</b>: ' + vehicle.inv_description + '</p>'
        grid += '<p class="color">Color: ' + vehicle.inv_color + '</p>'
        grid += '<p class="miles"><b>Miles</b>: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        grid += '</div>'
    
    return grid
}

/* **************************************
* Build the login view HTML
* ************************************ */
/* Util.buildLoginGrid = async (req, res, next) => {
    let grid
    grid = '<div class="container">'
    grid += '<form action="#" method="POST" id="submittedForm">'
    grid += '<label for="account_email"> Email *<input type="email" name="account_email" id="account_email" required></label>'
    grid += '<label for="account_password"> Password *<input type="password" name="account_password" id="account_password" required><span id="pswdBtn">show password</span></label>'
    grid += '<input type="submit" value="login">'
    grid += '</form>'
    grid += '<p>No account? <a href="/account/register">Sign-up</a></p>'
    grid += '</div>'
    
    return grid
}
 */
/* **************************************
* Build the registration view HTML
* ************************************ */
/* Util.buildRegistrationGrid = async (req, res, next) => {
    let grid
    grid = '<div class="container">'
    grid += '<form action="#" method="POST" id="submittedForm">'
    grid += '<label for="account_firstname"> First name *<input type="text" name="account_firstname" id="account_firstname" required></label>'
    grid += '<label for="account_lastname"> Last name *<input type="text" name="account_lastname" id="account_lastname" required></label>'
    grid += '<label for="account_email"> Email *<input type="email" name="account_email" id="account_email" required></label>'
    grid += '<label for="account_password"> Password *<input type="password" name="account_password" id="account_password" required><span id="pswdBtn">show password</span></label>'
    grid += '<input type="submit" value="Register">'
    grid += '</form>'
    grid += '<p>Have account? <a href="/account/login">Sing-in</a></p>'
    grid += '</div>'
    
    return grid
}
 */
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
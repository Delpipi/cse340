const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountModel = require('../models/account-model')
const reservationModel = require('../models/reservation-model')
const Util = {}

/* *****************************
 * Constructs the nav HTML unordered list
 ********************************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
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
* Build classification drop-down select list
* ************************************ */
Util.buildClassificationList = async (classification_id = null) => {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += '<option value = "">Choose a classification</option>'
    data.rows.forEach((row) => {
        classificationList += '<option value = "' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += 'selected'
        }
        classificationList += '>' + row.classification_name + '</option>'
    })
    classificationList += '</select>'
    return classificationList
}

/*********************************
* Build reservation datatable
**********************************/
Util.buildReservationDataTable = async (account_id = null) => {
    let reservations = []

    if (account_id) {
        reservations = await reservationModel.getReservationListByAccountId(account_id)
    } else {
        reservations = await reservationModel.getReservationList()
    }

    let dataTable = ''

    if (reservations.length > 0) {
        // Set up the table labels
        dataTable += '<thead>'
        dataTable += '<tr><th>Vehcile Name</th><th>Quantity</th><th>Price</th><th>Action</th></tr>';
        dataTable += '</thead>'
        // Set up the table body
        dataTable += '<tbody>'
        // Iterate over all reservation in the array and put each in a row 
        reservations.forEach(element => {
            console.log(element.inventory_id + ", " + element.inventory_model)
            dataTable += `<tr><td>${element.inventory_make} ${element.inventory_model}</td>`
            dataTable += `<td>${element.inventory_qty}</td>`
            dataTable += '<td>$'+ new Intl.NumberFormat('en-US').format(element.inventory_price) +'</td>' 
            dataTable += `<td>
            <form action="/reservation/delete" method="POST">
            <input type="hidden" name="res_id" value="${element.res_id}" >
            <button type="submit">Delete</button>
            </form>
            </td>`
            dataTable += '</tr>'
        })
        dataTable += '</tbody>'
    } else {
         dataTable += '<tbody><tr>There is no reservation</tr></tbody>'
    }
    
    return dataTable
}


/******************************************
* Middleware to check token validity
******************************************/
Util.checkJWTToken = async (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    res.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                if (accountData.account_type === 'Client') {
                    if ( (req.path === '/inv' || req.path === '/inv/')) {
                        req.flash("notice", "Log in as Admin or Employee to access inventory management view")
                        return res.redirect("/account/login")
                    }
                }
                next()
            }
        )
    } else {
        if (req.path === '/inv' || req.path === '/inv/'
            || req.path === '/account' || req.path === '/account/'
            || req.originalUrl.startsWith('/reservation')) {
            req.flash("notice", "Please Log in to access view")
            return res.redirect("/account/login")
        }
        next()
    }
}

/* ****************************************
 *  Check Login
 * ****************************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check Login
 * ****************************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}


//Check email
Util.checkEmail = async (req, res, next) => {
    const { account_email } = req.body
    if (res.locals.accountData) {
        if (account_email != res.locals.accountData.account_email) {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists) {
                req.flash("notice", `Email: ${account_email} exists. Please use different email`)
                return res.redirect(`/account/update/${res.locals.accountData.account_id}`)
            }
        }
    }
    next()
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

/* app.use((err, req, res, next) => {
  console.error(err.stack); // for debugging
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}); */
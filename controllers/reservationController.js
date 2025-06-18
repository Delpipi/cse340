/*******************************
*  Reservation Controller
*******************************/

//Need Resources
const utilities = require('../utilities/')
const reservationModel = require('../models/reservation-model')

reservationCont = {}

/* ************************************
 *  Build Reservation view
 * *************************************/
reservationCont.buildReservation = async (req, res, next) => {
    let nav = await utilities.getNav()
    let dataTable = await utilities.buildReservationDataTable(req.params.account_id)
    
    let total = 0
    if (req.params.account_id) {
        total = await reservationModel.getReservationTotalCostByAccountId(req.params.account_id)
    } else {
        total = await reservationModel.getReservationTotalCost()
    }

    res.render('./reservation/index', {
        title: 'Reservation Management',
        smallCssFile: 'reservation.css',
        largeCssFile: 'reservation-large.css',
        nav,
        total,
        dataTable
    })
}


/* ************************************
 *  Add Reservation 
 * *************************************/
reservationCont.addReservation = async (req, res, next) => {
    //console.log(req.body)
    try {
        const { account_id, inventory_id, inventory_make, inventory_model, inventory_thumbnail, inventory_price, inventory_qty } = req.body
        
        let addReservation = {}
        
        const reservation = await reservationModel.getReservationByAccountIdAndInventoryId(account_id, inventory_id)
        
        if (reservation) {
            reservation.inventory_qty += 1;
            addReservation = await reservationModel.updateReservation(
                reservation.res_id,
                reservation.account_id,
                reservation.inventory_id,
                reservation.inventory_make,
                reservation.inventory_model,
                reservation.inventory_thumbnail,
                reservation.inventory_price,
                reservation.inventory_qty)
        } else {
            addReservation = await reservationModel.addReservation(account_id,
                inventory_id, inventory_make, inventory_model, inventory_thumbnail,
                inventory_price, inventory_qty)
        }
        
        if (addReservation) {
            return res.status(201).send("Congratulations! Your reservation is done.")
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server error while processing reservation.")
    }
}


reservationCont.deleteReservation = async (req, res, next) => {

    try {
        const { res_id } = req.body

        const data = await reservationModel.deleteReservationById(res_id)
            
        if (data) {
            req.flash("notice", 'Deletion completed successfull.')
            if (res.locals.accountData.account_type === 'Client') {
                res.status(201).redirect(`/reservation/accounts/${res.locals.accountData.account_id}`)
            } else {
                res.status(201).redirect(`/reservation/accounts`)
            }
        } else {
            req.flash("notice", 'Deletion failed.')
            if (res.locals.accountData.account_type === 'Client') {
                res.status(501).redirect(`/reservation/accounts/${res.locals.accountData.account_id}`)
            } else {
                res.status(501).redirect(`/reservation/accounts`)
            }
        }
        
    } catch (error) {
        console.error(error)
        throw new Error("")
    }
}

module.exports = reservationCont
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

/* ***********************************************
 *  Get Reservation by Account Id and inventory id
 * ***********************************************/
reservationCont.getReservationJSON = async (req, res, next) => {
    //console.log(req.body)
    const { account_id, inventory_id } = req.body
    try {
        if (account_id && inventory_id) {
            const reservation = await reservationModel.getReservationByAccountIdAndInventoryId(account_id, inventory_id)
            if (reservation && reservation.res_id) {
                return res.status(200).json(reservation)
            }else {
                return res.status(404).send("Reservation not found")
            }
        } else {
            return res.status(400).json("Missing required data.")
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server error while processing reservation.")
    }
}

/* ************************************
 *  Add Reservation 
 * *************************************/
reservationCont.addReservation = async (req, res, next) => {
    //console.log(req.body)
    try {
        const { account_id, inventory_id, inventory_make, inventory_model, inventory_thumbnail, inventory_price, inventory_qty } = req.body

        if (account_id && inventory_id && inventory_make && inventory_model
            && inventory_thumbnail && inventory_price && inventory_qty) {
            
            const reservation = await reservationModel.addReservation(account_id,
                inventory_id, inventory_make, inventory_model, inventory_thumbnail,
                inventory_price, inventory_qty)
            
            if (reservation) {
                return res.status(201).send("Congratulations! Your reservation is done.")
            } else {
                return res.status(400).send("Invalid reservation data.")
            }

        } else {
            return res.status(422).send("Missing required reservation data.")
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server error while processing reservation.")
    }
}

module.exports = reservationCont
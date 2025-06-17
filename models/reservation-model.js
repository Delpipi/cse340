const pool = require('../database/')

/******************************
*   Reservation Model
*******************************/
async function getReservationListByAccountId(account_id) {
    try {
        const sql = "SELECT inventory_id, inventory_make,inventory_model,inventory_thumbnail, inventory_price, inventory_qty FROM public.reservation WHERE account_id = $1"
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error('getReservationListByAccountId error ' + error)
    }
}

async function getReservationByAccountIdAndInventoryId(account_id, inventory_id) {
    try {
        const data = await pool.query(`SELECT * FROM public.reservation WHERE account_id=$1 and inventory_id=$2`, [account_id, inventory_id])
        return data.rows[0]
    } catch (error) {
        console.error('getReservationByAccountIdAndInventoryId error ' + error)
    }
}

async function getReservationList() {
    try {
        const sql = "SELECT account_id, inventory_id, inventory_make,inventory_model,inventory_thumbnail, inventory_price, inventory_qty FROM public.reservation"
        return await pool.query(sql)
    } catch (error) {
        console.error('getReservationList error ' + error)
    }
}

async function addReservation(account_id, inventory_id, inventory_make,inventory_model,inventory_thumbnail, inventory_price, inventory_qty) {
    
    try {
        const sql = "INSERT INTO public.reservation (account_id, inventory_id, inventory_make, inventory_model, inventory_thumbnail, inventory_price, inventory_qty)"
        + " VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
    
        const data = await pool.query(sql, [
            account_id,
            inventory_id,
            inventory_make,
            inventory_model,
            inventory_thumbnail,
            inventory_price,
            inventory_qty])
    
        return data.rows[0]

    } catch (error) {
         console.error('addReservation error ' + error)
    }
    
}

async function deleteReservationById(res_id) {
    try {
        const sql = 'DELETE FROM public.reservation WHERE res_id = $1'
        return await pool.query(sql, [res_id]) // 0 or 1
    } catch (error) {
        console.error('deleteReservationById error ' + error)
    }
}

async function getReservationTotalCostByAccountId(account_id) {
    const sql = "SELECT COALESCE(SUM(inventory_qty * inventory_price), 0) AS total_reservation FROM public.reservation WHERE account_id=$1"
    const data = await pool.query(sql, [account_id])
    return Number(data.rows[0].total_reservation) 
}

async function getReservationTotalCost() {
    const sql = "SELECT COALESCE(SUM(inventory_qty * inventory_price), 0) AS total_reservation FROM public.reservation"
    const data = await pool.query(sql)
    return Number(data.rows[0].total_reservation)
}

module.exports = {
    getReservationListByAccountId, getReservationList, addReservation, deleteReservationById,
    getReservationTotalCostByAccountId, getReservationTotalCost, getReservationByAccountIdAndInventoryId
}
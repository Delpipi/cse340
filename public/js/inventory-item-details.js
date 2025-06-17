const btnReserve = document.querySelector('#btn-reserve');
const message = document.querySelector('#message');

const accountId = document.querySelector('input[name="account_id"]').value;
const inventoryId = btnReserve.dataset.invId;
const inventoryMake = btnReserve.dataset.invMake;
const inventoryModel = btnReserve.dataset.invModel;
const inventoryThumbnail = btnReserve.dataset.invThumbnail;
const inventoryPrice = btnReserve.dataset.invPrice;

async function getReservationByAccountIdAndInventoryId(accountId, inventoryId) {
    try {
        
        const response = await fetch('/reservation', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"account_id": accountId,"inventory_id": inventoryId})
        });
    
        return response;
    } catch (error) {
        console.error('Get Reservation by AccountId and inventoryId ' +error)
    }
}

async function addReservation(data) {
    try {
        
        const response = await fetch(`/reservation/accounts/${accountId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    
        return response;

    } catch (error) {
        console.error('addReservation error ' +error)
    }
}

btnReserve.addEventListener('click', async () => {
    
    if (!accountId || !inventoryId || !inventoryMake || !inventoryModel ||
        !inventoryThumbnail || !inventoryPrice) {
        message.textContent = 'Missing required data.';
        return;
    }

    try {
        const res = await getReservationByAccountIdAndInventoryId(accountId, inventoryId);
        
        let inventory_qty = 1;
        
        if (res.ok) {
            inventory_qty = res.inventory_qty + 1;
        }

        const data = {
            "account_id": accountId,
            "inventory_id": inventoryId,
            "inventory_make": inventoryMake,
            "inventory_model": inventoryModel,
            "inventory_thumbnail": inventoryThumbnail,
            "inventory_price": inventoryPrice,
            "inventory_qty": inventory_qty
        }

        const response = await addReservation(data);
        message.textContent = await response.text();
    } catch (error) {
        console.error(error)
    }
});
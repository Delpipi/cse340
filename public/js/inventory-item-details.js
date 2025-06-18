const btnReserve = document.querySelector('#btn-reserve');
const messages = document.querySelector('#messages');

const accountId = document.querySelector('input[name="account_id"]').value;
const inventoryId = btnReserve.dataset.invId;
const inventoryMake = btnReserve.dataset.invMake;
const inventoryModel = btnReserve.dataset.invModel;
const inventoryThumbnail = btnReserve.dataset.invThumbnail;
const inventoryPrice = btnReserve.dataset.invPrice;

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
        
        const data = {
            "account_id": accountId,
            "inventory_id": inventoryId,
            "inventory_make": inventoryMake,
            "inventory_model": inventoryModel,
            "inventory_thumbnail": inventoryThumbnail,
            "inventory_price": inventoryPrice,
            "inventory_qty": 1
        }

        const response = await addReservation(data);
        if (response.status === 400) {
            let errorData = await response.json();
            messages.innerHTML = errorData.errors.map(error => `<li>${error.msg}</li>`).join("");
        } else {
            const message = await response.text();
            messages.innerHTML = `<li>${message}</li>`;
        }

    } catch (error) {
        console.error(error)
    }
});
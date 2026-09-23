const SUPABASE_URL = "https://ktflfwwjpfqrdibwtaql.supabase.co";
const SUPABASE_KEY = "sb_publishable_viDShjwa3XTcNWCJfqm5yA_wZLnFAFZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ================= NAVBAR =================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});


// ================= PRE-ORDER MENU =================

const menuHeaders = document.querySelectorAll(".menu-selection-header");

menuHeaders.forEach(function (header) {

    header.addEventListener("click", function () {

        const menuSelection = header.parentElement;

        menuSelection.classList.toggle("active");

    });

});


// ================= SELECTED ITEMS =================

const menuOptions = document.querySelectorAll(
    '.menu-option input[type="checkbox"]'
);

const selectedItemsContainer = document.getElementById("selectedItems");
const preorderTotal = document.getElementById("preorderTotal");

const selectedItems = {};


// ================= ADD / REMOVE ITEM =================

menuOptions.forEach(function (checkbox) {

    checkbox.addEventListener("change", function () {

        const name = checkbox.dataset.name;
        const price = Number(checkbox.dataset.price);

        if (checkbox.checked) {

            selectedItems[name] = {
                price: price,
                quantity: 1
            };

        } else {

            delete selectedItems[name];

        }

        renderSelectedItems();

    });

});


// ================= CALCULATE TOTAL =================

function calculatePreOrderTotal() {

    let total = 0;

    Object.keys(selectedItems).forEach(function (name) {

        const item = selectedItems[name];

        total += item.price * item.quantity;

    });

    return total;

}


// ================= RENDER SELECTED ITEMS =================

function renderSelectedItems() {

    selectedItemsContainer.innerHTML = "";

    const total = calculatePreOrderTotal();


    Object.keys(selectedItems).forEach(function (name) {

        const item = selectedItems[name];

        const itemTotal = item.price * item.quantity;


        const selectedItem = document.createElement("div");

        selectedItem.classList.add("selected-item");


        selectedItem.innerHTML = `

            <span class="selected-item-name">
                ${name}
            </span>

            <div class="quantity-controls">

                <button type="button" class="quantity-minus">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button type="button" class="quantity-plus">
                    +
                </button>

            </div>

            <span class="selected-item-price">
                $${itemTotal}
            </span>

        `;


        selectedItemsContainer.appendChild(selectedItem);


        // Minus

        selectedItem
            .querySelector(".quantity-minus")
            .addEventListener("click", function () {

                if (item.quantity > 1) {

                    item.quantity--;

                } else {

                    delete selectedItems[name];

                    checkboxForItem(name).checked = false;

                }

                renderSelectedItems();

            });


        // Plus

        selectedItem
            .querySelector(".quantity-plus")
            .addEventListener("click", function () {

                item.quantity++;

                renderSelectedItems();

            });

    });


    preorderTotal.textContent = `$${total}`;

}


// ================= FIND CHECKBOX =================

function checkboxForItem(name) {

    return document.querySelector(
        `.menu-option input[data-name="${name}"]`
    );

}


// ================= RESERVATION =================

const reservationForm = document.querySelector("#reservationForm");

reservationForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name = reservationForm.querySelector(
        'input[type="text"]'
    ).value;

    const email = reservationForm.querySelector(
        'input[type="email"]'
    ).value;

    const phone = reservationForm.querySelector(
        'input[type="tel"]'
    ).value;

    const date = document.querySelector(
        "#reservationDate"
    ).value;

    const time = reservationForm.querySelector(
        'input[type="time"]'
    ).value;

    const guests = parseInt(
        reservationForm.querySelector("select").value
    );


    // ================= PRE-ORDER DATA =================

    const preorderData = Object.keys(selectedItems)
    .map(function (name) {

        return `${name} × ${selectedItems[name].quantity}`;

    })
    .join("\n");


    const preorderTotalValue = calculatePreOrderTotal();


    // ================= SAVE TO SUPABASE =================

    const { error } = await supabaseClient
        .from("reservations")
        .insert([
            {
                name: name,
                email: email,
                phone: phone,
                reservation_date: date,
                reservation_time: time,
                guests: guests,
                preorder_items: preorderData,
                preorder_total: preorderTotalValue
            }
        ]);


    if (error) {

        alert("Something went wrong. Please try again.");

        console.error(error);

        return;

    }


    alert("Your table has been reserved successfully! ✨");


    reservationForm.reset();


    // Clear selected items

    Object.keys(selectedItems).forEach(function (name) {

        delete selectedItems[name];

    });


    menuOptions.forEach(function (checkbox) {

        checkbox.checked = false;

    });


    renderSelectedItems();

});


// ================= MINIMUM DATE =================

const reservationDate = document.querySelector(
    "#reservationDate"
);

const today = new Date()
    .toISOString()
    .split("T")[0];

reservationDate.min = today;
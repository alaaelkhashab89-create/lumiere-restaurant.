console.log("ADMIN JS IS WORKING");
console.log("Supabase:", window.supabase);
const SUPABASE_URL = "https://ktflfwwjpfqrdibwtaql.supabase.co";
const SUPABASE_KEY = "sb_publishable_viDShjwa3XTcNWCJfqm5yA_wZLnFAFZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ================= LOAD RESERVATIONS =================

async function loadReservations() {

    const { data, error } = await supabaseClient
        .from("reservations")
        .select("*")
        .order("reservation_date", { ascending: true });
console.log("Reservations:", data);
console.log("Supabase Error:", error);

    if (error) {

        console.error(error);

        document.getElementById("reservationsList").innerHTML =
            "<p>Something went wrong while loading reservations.</p>";

        return;
    }


    const reservationsList =
        document.getElementById("reservationsList");

    const reservationCount =
        document.getElementById("reservationCount");


    reservationCount.textContent =
        `${data.length} reservation${data.length === 1 ? "" : "s"}`;


    reservationsList.innerHTML = "";


    data.forEach(function (reservation) {

        const card = document.createElement("div");

        card.classList.add("reservation-card");


        card.innerHTML = `

            <div class="reservation-info">

                <h3>${reservation.name}</h3>

                <p>${reservation.email}</p>

                <p>${reservation.phone}</p>

            </div>


            <div class="reservation-details">

                <p>
                    <strong>Date:</strong>
                    ${reservation.reservation_date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${reservation.reservation_time || "Not specified"}
                </p>

                <p>
                    <strong>Guests:</strong>
                    ${reservation.guests}
                </p>

            </div>


            <div class="reservation-preorder">

                <h4>Pre-Order</h4>

                <p>
                    ${reservation.preorder_items || "No pre-order"}
                </p>

                <strong>
                    Total: $${reservation.preorder_total || 0}
                </strong>

            </div>

        `
        ;


        reservationsList.appendChild(card);

    });

}


// Load reservations when page opens
loadReservations();
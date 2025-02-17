// ====== ORDER MANAGEMENT ======
const prices = {
    "Dumplings": 10,
    "Hot pot": 15,
    "Asian Lettuce wrap": 8,
    "Chicken chow mein": 12,
    "Veg-fried rice": 7,
    "Spring roll": 5
};

let orderItems = {};

function changeQuantity(itemName, change) {
    if (!orderItems[itemName]) {
        orderItems[itemName] = { quantity: 0, total: 0 };
    }

    orderItems[itemName].quantity += change;
    if (orderItems[itemName].quantity < 0) {
        orderItems[itemName].quantity = 0;
    }

    orderItems[itemName].total = orderItems[itemName].quantity * prices[itemName];

    document.getElementById(`quantity-${itemName}`).innerText = orderItems[itemName].quantity;
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderTableBody = document.getElementById('order-items');
    orderTableBody.innerHTML = '';

    let serialNo = 1;
    for (const itemName in orderItems) {
        const item = orderItems[itemName];
        if (item.quantity > 0) {
            const row = `<tr>
                <td>${serialNo}</td>
                <td>${itemName}</td>
                <td>${item.quantity}</td>
                <td>$${item.total}</td>
                <td>
                    <select>
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                    </select>
                </td>
                <td><button onclick="removeItem('${itemName}')">Remove</button></td>
            </tr>`;
            orderTableBody.innerHTML += row;
            serialNo++;
        }
    }
}

function removeItem(itemName) {
    delete orderItems[itemName];  // Properly remove the item
    updateOrderSummary();
}

function placeOrder() {
    if (Object.keys(orderItems).length === 0) {
        alert("No items in the order!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderItems);
    localStorage.setItem('orders', JSON.stringify(orders));

    alert('Your order has been placed successfully!');
    orderItems = {};  // Clear order after placing
    updateOrderSummary();
}

// ====== AUTHENTICATION ======
function toggleAuthSidebar() {
    const sidebar = document.getElementById('authSidebar');
    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
}

function openLogin() {
    document.getElementById("authSidebar").style.display = "block";
    document.getElementById("authTitle").textContent = "Login";
    document.getElementById("toggleForm").innerHTML =
        `Don't have an account? <a href="#" onclick="openSignup()">Sign up</a>`;
}

function openSignup() {
    document.getElementById("authSidebar").style.display = "block";
    document.getElementById("authTitle").textContent = "Sign Up";
    document.getElementById("toggleForm").innerHTML =
        `Already have an account? <a href="#" onclick="openLogin()">Login</a>`;
}

// Handle login and signup
document.addEventListener("DOMContentLoaded", function () {
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const authTitle = document.getElementById('authTitle').textContent;

            let users = JSON.parse(localStorage.getItem('users')) || {};

            if (authTitle === "Sign Up") {
                if (users[email]) {
                    alert("Account already exists! Please login.");
                } else {
                    users[email] = password;
                    localStorage.setItem('users', JSON.stringify(users));
                    alert("Account created successfully! Please login.");
                    openLogin();
                }
            } else {
                if (users[email] && users[email] === password) {
                    alert("Login successful! Welcome.");
                    toggleAuthSidebar();
                } else {
                    alert("Invalid email or password.");
                }
            }
        });
    }
});

// Handle Admin Login
function openAdminLogin() {
    const email = prompt("Enter Admin Email:");
    const password = prompt("Enter Admin Password:");

    if (email === "admin@example.com" && password === "admin123") {
        alert("Admin Login Successful!");
        window.location.href = "admin.html";
    } else {
        alert("Invalid Admin Credentials!");
    }
}

// ====== SAVE & LOAD ADMIN DATA ======
window.onload = function () {
    if (window.location.pathname.includes("admin.html")) {
        loadAdminData();
    }
};

function loadAdminData() {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Load Users
    const userTable = document.getElementById('userTable')?.querySelector('tbody');
    if (userTable) {
        userTable.innerHTML = "";
        for (let email in users) {
            let row = `<tr><td>${email}</td><td>${users[email]}</td></tr>`;
            userTable.innerHTML += row;
        }
    }

    // Load Reservations
    const reservationTable = document.getElementById('reservationTable')?.querySelector('tbody');
    if (reservationTable) {
        reservationTable.innerHTML = "";

        if (reservations.length === 0) {
            reservationTable.innerHTML = `<tr><td colspan="6">No reservations found</td></tr>`;
        } else {
            reservations.forEach((res, index) => {
                let row = `<tr>
                     <td>${res.name}</td>
                     <td>${res.contact}</td>
                     <td>${res.guests}</td>
                     <td>${res.date}</td>
                     <td>${res.time}</td>
                     <td>${res.specialRequests || "None"}</td>
                 </tr>`;
                reservationTable.innerHTML += row;
            });
        }
    }

    // Load Feedbacks
    const feedbackTable = document.getElementById('feedbackTable')?.querySelector('tbody');
    if (feedbackTable) {
        feedbackTable.innerHTML = "";
        feedbacks.forEach(fb => {
            let row = `<tr><td>${fb.name}</td><td>${fb.email}</td><td>${fb.message}</td></tr>`;
            feedbackTable.innerHTML += row;
        });
    }

    // Load Orders
    const orderTable = document.getElementById('orderTable')?.querySelector('tbody');
    if (orderTable) {
        orderTable.innerHTML = "";
        orders.forEach((order, index) => {
            Object.keys(order).forEach(itemName => {
                let item = order[itemName];
                let row = `<tr>
                    <td>${index + 1}</td>
                    <td>${itemName}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.total}</td>
                    <td>${item.deliveryOption || 'N/A'}</td>
                </tr>`;
                orderTable.innerHTML += row;
            });
        });
    }
}

// ====== CONTACT FORM ======
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const feedback = {
        name: document.getElementById('contact-name').value,  // Corrected ID
        email: document.getElementById('contact-email').value, // Corrected ID
        message: document.getElementById('contact-message').value // Corrected ID
    };

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    alert("Feedback submitted!");
    document.getElementById('contact-form').reset();
});
// ====== RESERVATION FORM HANDLING ======
document.getElementById('reservation-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const reservation = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        guests: document.getElementById('guests').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        specialRequests: document.getElementById('special-requests').value
    };

    // Retrieve existing reservations or create an empty array
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);

    // Store updated reservations in localStorage
    localStorage.setItem('reservations', JSON.stringify(reservations));

    alert("Reservation successful!");
    document.getElementById('reservation-form').reset();
});

document.addEventListener("DOMContentLoaded", function () {
    const authButtons = document.getElementById("authButtons");

    function checkSectionVisibility() {
        const homeSection = document.querySelector(".container"); // Home section
        const rect = homeSection.getBoundingClientRect();

        // Show buttons only when the home section is in view
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            authButtons.style.display = "block";
        } else {
            authButtons.style.display = "none";
        }
    }

    // Run on page load and on scroll
    checkSectionVisibility();
    window.addEventListener("scroll", checkSectionVisibility);
});

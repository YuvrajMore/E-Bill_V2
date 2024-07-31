// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    getBills();
    applyThemeFromLocalStorage();
});

function checkLoggedInUser() {
    // check if there is a logged-in user in localStorage
    const currentUser = localStorage.getItem('adminLogin');

    if (!currentUser) {
        // if no user is logged in, redirect to the login page
        window.location.href = 'admin_login.html'; // adjust the path as per your file structure
    }
}

// function to handle logout
function logoutUser() {
    localStorage.removeItem('adminLogin'); // remove current user session data
}

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = 'admin_login.html';
});

function getBills() {
    // Retrieve users and requests from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || []; // Assuming users are stored in 'users' key
    let requests = JSON.parse(localStorage.getItem('requests')) || []; // Assuming requests are stored in 'requests' key
    requests = requests.filter(request => Array.isArray(request.bills) && request.bills.length > 0);
    // Get the table body where rows will be inserted
    let tableBody = document.getElementById('table-body');

    // Function to find user by email
    function findUserByEmail(email) {
        return users.find(user => user.email === email);
    }

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate through each connection in requests
    requests.forEach(connection => {
        // Iterate through each bill in the connection
        connection.bills.forEach(bill => {
            // Find the user associated with this connection (based on email)
            let user = findUserByEmail(connection.email);

            let pm = bill.paymentMethod || '-';
            let pd = bill.dateOfPayment || '-';
            // Populate each cell in the row
            row = `<tr>
                <td>${bill.billNumber}</td>
                <td>${user ? user.fname + ' ' + user.lname : '-'}</td>
                <td>${connection.email}</td>
                <td>${connection.connect_id}</td>
                <td>${bill.dateGenerated}</td>
                <td>${bill.dueDate}</td>
                <td>${pd}</td>
                <td>${bill.amount}</td>
                <td>${bill.status}</td>
                <td>${pm}</td>
                </tr>
            `;

            // Append the row to the table body
            tableBody.innerHTML += row;
        });
    });
};

// function to apply dark mode classes and specific styles to an element and its children
function applyDarkModeStyles(element) {
    // add bg-dark and text-light classes to all elements
    element.classList.add('bg-dark', 'text-light');

    // apply specific styles to anchors and buttons
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#87cefa', 'important'); // change link color with !important
    } else if (element.tagName === 'BUTTON') {
        element.style.setProperty('background-color', '#000000', 'important'); // change button background color with !important
    } else if (element.tagName === 'INPUT' && element.getAttribute('type') === 'radio') {
        element.style.setProperty('border-color', 'white', 'important'); // change button background color with !important
    }

    // recursively apply styles to all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        applyDarkModeStyles(children[i]);
    }
}

// function to remove dark mode classes and specific styles from an element and its children
function removeDarkModeStyles(element) {
    // remove bg-dark and text-light classes from all elements
    element.classList.remove('bg-dark', 'text-light');

    // remove specific styles from anchors and buttons
    if (element.tagName === 'A') {
        element.style.removeProperty('color'); // remove custom link color
    } else if (element.tagName === 'BUTTON') {
        element.style.removeProperty('background-color'); // reset button background color to default
    } else if (element.tagName === 'INPUT' && element.getAttribute('type') === 'radio') {
        element.style.setProperty('border-color', 'black', 'important'); // change button background color with !important
    }

    // recursively remove styles from all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        removeDarkModeStyles(children[i]);
    }
}

// function to enable dark mode
function enableDarkMode() {
    applyDarkModeStyles(document.body);
    localStorage.setItem('theme', 'dark-mode');
}

// function to disable dark mode
function disableDarkMode() {
    removeDarkModeStyles(document.body);
    localStorage.setItem('theme', 'light-mode');
}

// function to toggle between light and dark mode
function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark-mode') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// function to check localStorage and apply theme accordingly
function applyThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        enableDarkMode();
    } else {
        disableDarkMode(); // default to light mode
    }
}

document.getElementById('toggle-theme-button').addEventListener('click', function (event) {
    toggleTheme();
});
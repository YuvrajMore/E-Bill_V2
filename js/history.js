// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    getBills();
});

// apply theme based on localStorage when the document loads
applyThemeFromLocalStorage();

function checkLoggedInUser() {
    // check if there is a logged-in user in localStorage
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        // if no user is logged in, redirect to the login page
        window.location.href = '../index.html';
    }
}

function getBills() {
    // Retrieve current user from localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Retrieve requests from localStorage
    let requests = JSON.parse(localStorage.getItem('requests')) || [];

    // Filter requests to include only those matching current user's email
    requests = requests.filter(request => request.email === currentUser.email);

    // Get the table body where rows will be inserted
    let tableBody = document.getElementById('paymentsTableBody');

    // Function to format date as per requirement
    function formatDate(date) {
        // Assuming date format is MM/DD/YYYY
        let [month, day, year] = date.split('/');
        return `${year}-${month}-${day}`;
    }

    // Clear existing table rows
    tableBody.innerHTML = '';

    let billsCount = 0;
    // Iterate through each request for the current user
    requests.forEach(connection => {
        // Iterate through each bill in the connection
        connection.bills.forEach(bill => {
            billsCount++;
            let pm = bill.paymentMethod || '-';
            let pd = bill.dateOfPayment ? formatDate(bill.dateOfPayment) : '-';
            
            // Populate each cell in the row
            let row = `<tr>
                <td>${bill.billNumber}</td>
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

    if (billsCount === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">You currently have no Payment History</td></tr>';
    }

    applyThemeFromLocalStorage(); // Assuming this function applies the theme based on localStorage
}

// Function to handle logout
function logoutUser() {
    // remove current user data
    localStorage.removeItem('currentUser');
}

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = '../index.html';
});

// function to apply dark mode classes and specific styles to an element and its children
function applyDarkModeStyles(element) {
    // add bg-dark and text-light classes to all elements
    element.classList.add('bg-dark', 'text-light');

    // apply specific styles to anchors and buttons
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#87cefa', 'important'); // change link color with !important
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'BUTTON') {
        element.style.setProperty('background-color', '#000000', 'important'); // change button background color with !important
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
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'BUTTON') {
        element.style.removeProperty('background-color'); // reset button background color to default
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
        disableDarkMode(); // Default to light mode
    }
}

// toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});
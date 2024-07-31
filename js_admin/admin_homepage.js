// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
});

// apply theme based on localStorage when the document loads
applyThemeFromLocalStorage();

function checkLoggedInUser() {
    // check if there is a loggedin user in localStorage
    const currentUser = localStorage.getItem('adminLogin');

    if (!currentUser) {
        // if no user is logged in, redirect to the login page
        window.location.href = 'admin_login.html'
    }
}

// Function to handle logout
function logoutUser() {
    // remove current user data
    localStorage.removeItem('adminLogin');
}

// Event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = 'admin_login.html';
});

document.addEventListener('DOMContentLoaded', function () {
    // fetch data from localStorage
    const usersData = JSON.parse(localStorage.getItem('users')) || [];

    // reference to the User Account Details container
    const userAccountDetailsContainer = document.querySelector('.user-account-details');

    // generate table structure
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'bg-dark', 'text-light', 'mt-3');
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = `
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
        </tr>
    `;
    const tableBody = document.createElement('tbody');

    // populate table with user data
    usersData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fname}</td>
            <td>${user.lname}</td>
            <td>${user.email}</td>
            <td>${user.number}</td>
            <td>${user.locality}, ${user.city}, ${user.district}, ${user.state}</td>
        `;
        tableBody.appendChild(row);
    });

    // append table to the container
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    userAccountDetailsContainer.appendChild(table);
    applyThemeFromLocalStorage();
});

// function to apply dark mode classes and specific styles to an element and its children
function applyDarkModeStyles(element) {
    // add bg-dark and text-light classes to all elements
    element.classList.add('bg-dark', 'text-light');

    // apply specific styles to anchors and buttons
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#87cefa', 'important'); // change link color with !important
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
        disableDarkMode(); // default light mode
    }
}

document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});
// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    displayUserData(userData);
    displayUserConnections(userData);
    getBills();
    loadComplaints();
    applyThemeFromLocalStorage();
});

function displayUserData(userData){
    document.getElementById('name').innerHTML += ` ${userData.fname} ${userData.lname}`;
    document.getElementById('email').innerHTML += ` ${userData.email}`;
    document.getElementById('number').innerHTML += ` ${userData.number}`;
    document.getElementById('address').innerHTML += getAddress();
}

function displayUserConnections(currentUser) {
    // Retrieve connection requests from localStorage
    let requests = JSON.parse(localStorage.getItem('requests')) || [];

    // Filter requests related to the currentUser's email
    let userRequests = requests.filter(request => request.email === currentUser.email);

    // Display user connections in the table
    let connectionsTableBody = document.getElementById('connectionsTableBody');
    connectionsTableBody.innerHTML = '';

    let currentConnectionsCount = 0;

    userRequests.forEach(request => {
        currentConnectionsCount++;
        let row = `
            <tr>
                <td>${request.connect_id != null ? request.connect_id : '-'}</td>
                <td>${request.houseFlat}, ${request.houseName}, ${request.locality}, ${request.city}, ${request.district}, ${request.state}</td>
                <td>${request.loadType}</td>
                <td>${request.meterType}</td>
                <td>${request.applStatus}</td>
                <td>${request.applStatus === 'Rejected' ? request.reason : '-'}</td>
            </tr>
        `;
        connectionsTableBody.innerHTML += row;
    });

    if (currentConnectionsCount === 0) {
        connectionsTableBody.innerHTML = '<tr><td colspan="8">You currently have no connections or requests.</td></tr>';
    }
    applyThemeFromLocalStorage();
}

function getAddress()
{
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    const address = `${userData.houseFlat}, ${userData.houseName}, ${userData.locality}, ${userData.city}, ${userData.district}, ${userData.state}`
    return address;
}

function checkLoggedInUser() {
    // check if there is a logged-in user in localStorage
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        // if no user is logged in, redirect to the login page
        window.location.href = '../index.html'; // adjust the path as per your file structure
    }
}

// function to handle logout
function logoutUser() {
    localStorage.removeItem('currentUser'); // remove current user session data
}

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = '../index.html';
});

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

    let pendingBillsCount = 0;

    // Iterate through each request for the current user
    requests.forEach(connection => {
        // Iterate through each bill in the connection
        connection.bills.forEach(bill => {
            if (bill.status === "Pending") {
                pendingBillsCount++;
                
                // Populate each cell in the row
                let row = `<tr>
                    <td>${bill.billNumber}</td>
                    <td>${connection.connect_id}</td>
                    <td>${bill.dateGenerated}</td>
                    <td>${bill.dueDate}</td>
                    <td>${bill.amount}</td>
                    <td>${bill.status}</td>
                    </tr>
                `;

                // Append the row to the table body
                tableBody.innerHTML += row;
            }
        });
    });

    if (pendingBillsCount === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">You currently have no pending bills</td></tr>';
    }

    applyThemeFromLocalStorage(); // Assuming this function applies the theme based on localStorage
}


function loadComplaints() {
    const ticketsTableBody = document.getElementById('ticketsTableBody');
    const resolveForm = document.getElementById('resolveForm');
    const resolutionInput = document.getElementById('resolution');

    // Function to fetch complaints from localStorage
    function getComplaints() {
        return JSON.parse(localStorage.getItem('complaints')) || [];
    }

    // Function to fetch current user from localStorage
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    // Function to render complaints table
    function renderComplaintsTable() {
        ticketsTableBody.innerHTML = ''; // Clear existing rows

        const complaints = getComplaints();
        const currentUser = getCurrentUser();
        let complaintsCount = 0;
        complaints.forEach((complaint, index) => {
            // Display complaints of the current user only
            if (complaint.email === currentUser.email) {
                complaintsCount++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${complaint.issueType}</td>
                    <td>${complaint.description}</td>
                    <td>${complaint.ticketStatus}</td>
                    <td>${complaint.resolution || '-'}</td>
                `;
                ticketsTableBody.appendChild(row);
            }
        });
        if(complaintsCount === 0){
            ticketsTableBody.innerHTML = '<tr><td colspan="8">You have not raised any tickets.</td></tr>';
        }
    }

    // Initial rendering of complaints table
    renderComplaintsTable();
}


// toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
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
        element.style.removeProperty('color'); // Remove custom link color
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'BUTTON') {
        element.style.removeProperty('background-color'); // Reset button background color to default
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

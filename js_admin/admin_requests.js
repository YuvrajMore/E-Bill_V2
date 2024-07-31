// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    displayConnectionRequests();
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

function getConnectionRequests() {
    let requests = localStorage.getItem('requests');
    if (!requests) {
        // handle case where no requests are found in localStorage
        document.getElementById('connection-requests-table-body').innerHTML = "No connection requests found.";
        console.log('No connection requests found.');
        return [];
    } else {
        return JSON.parse(requests);
    }
}
function displayConnectionRequests() {
    let requests = getConnectionRequests();

    // select the table body where requests will be displayed
    let tableBody = document.getElementById('connection-requests-table-body');
    if (!tableBody) {
        console.error('Table body for connection requests not found.');
        return;
    }

    // clear existing table rows if any
    tableBody.innerHTML = '';

    // iterate over requests and create table rows
    requests.forEach((request, index) => {
        let row = `
            <tr>
                <td>${request.connect_id}</td>
                <td>${request.fname} ${request.lname}</td>
                <td>${request.email}</td>
                <td>${request.houseFlat}, ${request.houseName},<br> ${request.locality}, ${request.city}, <br>${request.district}, ${request.state}</td>
                <td>${request.attachedFile}</td>
                <td>${request.meterType}</td>
                <td>${request.loadType}</td>
                <td>${request.applStatus}</td>
                <td>
        `;

        if (request.applStatus === 'Approved') {
            row += `<button type="button" id="addBillModalButton" class="btn mt-1 btn-primary btn-addBill" data-toggle="modal" data-target="#addBillModal" data-id="${request.connect_id}">Generate Bill</button>`;
        } else {
            row += `<button class="btn btn-success mt-1 btn-approve" data-id="${request.connect_id}">Approve</button>
            <button class="btn btn-danger mt-1 btn-reject" data-toggle="modal" data-target="#rejectModal" data-id="${request.connect_id}">Reject</button>`;
        }

        row += `
                </td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });


    // Add event listener to table body for approve and reject buttons
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-approve')) {
            let requestId = parseInt(event.target.getAttribute('data-id'));
            let request = getRequestById(requestId);
            if (request && request.applStatus === 'Pending') {
                approve(requestId);
            } else {
                console.log('Cannot approve request because its status is not Pending or request not found.');
            }
        } else if (event.target.classList.contains('btn-reject')) {
            let requestId = parseInt(event.target.getAttribute('data-id'));
            let request = getRequestById(requestId);
            if (request && request.applStatus === 'Pending') {
                reject(requestId);
            } else {
                console.log('Cannot reject request because its status is not Pending or request not found.');
            }
        } else if (event.target.classList.contains('btn-addBill')) {
            let requestId = parseInt(event.target.getAttribute('data-id'));
            let request = getRequestById(requestId);
            if (request && request.applStatus === 'Approved') {
                addBill(requestId);
            } else {
                console.log('Cannot generate bill for request because its status is not Approved or request not found.');
            }
        }
    });

    // Function to retrieve request by ID from localStorage
    function getRequestById(reqid) {
        let requests = JSON.parse(localStorage.getItem('requests')) || [];
        return requests.find(request => request.connect_id === reqid);
    }

    // Function to approve a request
    function approve(reqid) {
        let requests = JSON.parse(localStorage.getItem('requests')) || [];
        // Find the index of the request to be approved based on its connect_id
        let index = requests.findIndex(request => request.connect_id === reqid);

        if (index !== -1) {
            // Update the status of the request to "Approved"
            requests[index].applStatus = "Approved";

            // Update localStorage with the modified requests array
            localStorage.setItem('requests', JSON.stringify(requests));

            // Refresh the display of connection requests
            displayConnectionRequests();
        } else {
            console.error('Request not found in localStorage.');
        }
    }

    // Function to reject a request
    function reject(reqid) {
        let requests = JSON.parse(localStorage.getItem('requests')) || [];
        // Find the index of the request to be rejected based on its connect_id
        let index = requests.findIndex(request => request.connect_id === reqid);

        if (index !== -1) {
            // Get references to modal and form elements
            let rejectModal = document.getElementById('rejectModal');
            let rejectForm = rejectModal.querySelector('form');
            let reasonInput = rejectForm.querySelector('#reason');
            let closeButton = rejectModal.querySelector('[data-dismiss="modal"]');
            let confirmButton = rejectForm.querySelector('[type="submit"]');

            // Show the modal
            rejectModal.classList.add('show');
            rejectModal.style.display = 'block';

            // Handle close modal event
            closeButton.addEventListener('click', function () {
                hideModal(rejectModal);
            });

            // Handle form submission
            rejectForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent form submission

                let reason = reasonInput.value.trim();
                if (reason) {
                    // Update the status of the request to "Rejected" and add reason
                    requests[index].applStatus = "Rejected";
                    requests[index].reason = reason;

                    // Update localStorage with the modified requests array
                    localStorage.setItem('requests', JSON.stringify(requests));

                    // Hide the modal
                    hideModal(rejectModal);

                    // Refresh the display of connection requests
                    displayConnectionRequests();
                }
            });
        } else {
            console.error('Request not found in localStorage.');
        }
    }
    applyThemeFromLocalStorage();
}

function hideModal(modal) {
    // Remove the 'show' class to hide the modal
    modal.classList.remove('show');

    // Hide the modal after a short delay to allow transition effects
    setTimeout(function () {
        modal.style.display = 'none';

        // Remove the modal backdrop manually
        let modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            document.body.removeChild(modalBackdrop);
        }
    }, 300); // Adjust delay if necessary to match CSS transition duration
}

function addBill(reqid) {
    let addBillModal = document.getElementById('addBillModal');
    let addBillForm = addBillModal.querySelector('form');
    let amountInput = addBillForm.querySelector('#amount');
    let dueDateInput = addBillForm.querySelector('#due_date');
    let closeButton = addBillModal.querySelector('[data-dismiss="modal"]');
    let generateBillButton = addBillForm.querySelector('[type="submit"]');

    // Show the modal
    addBillModal.classList.add('show');
    addBillModal.style.display = 'block';

    // Handle close modal event
    closeButton.addEventListener('click', function () {
        hideModal(addBillModal);
    });

    // Handle form submission
    addBillForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        let amount = amountInput.value.trim();
        let dueDate = dueDateInput.value;

        // Validate input
        if (!amount || !dueDate) {
            console.log('Please fill out all fields.');
            return;
        }

        // Read the current bill count from localStorage
        let billCount = parseInt(localStorage.getItem('billCount')) || 5001;

        // Create a new bill object
        let newBill = {
            billNumber: billCount,
            dateGenerated: new Date().toLocaleDateString(), // Current date
            amount: parseFloat(amount), // Convert amount to number
            dueDate: dueDate,
            status: 'Pending'
        };

        // Increment bill count for the next bill
        localStorage.setItem('billCount', billCount + 1);

        // Retrieve requests from localStorage
        let requests = JSON.parse(localStorage.getItem('requests')) || [];

        // Find the index of the request to add bill based on its connect_id
        let index = requests.findIndex(request => request.connect_id === reqid);

        // Find the request object by ID
        let request = requests.find(request => request.connect_id === reqid);

        if (request) {
            // Check if the request already has a bills array
            if (Object.hasOwnProperty.call(request, 'bills')) {
                request.bills.push(newBill);
            } else {
                request.bills = [newBill];
            }

            // Update the requests array in localStorage
            localStorage.setItem('requests', JSON.stringify(requests));

            // Hide the modal
            hideModal(addBillModal);

            // Clear form fields for next use (optional)
            amountInput.value = '';
            dueDateInput.value = '';

            // Refresh the display of connection requests
            displayConnectionRequests();
        } else {
            console.error('Request not found in localStorage.');
        }
    });
}

function approve(reqid) {
    let requests = JSON.parse(localStorage.getItem('requests'));
    // Find the index of the request to be approved based on its connect_id
    let index = requests.findIndex(request => request.connect_id === reqid);

    if (index !== -1) {
        // Update the status of the request to "Approved"
        requests[index].applStatus = "Approved";

        // Update localStorage with the modified requests array
        localStorage.setItem('requests', JSON.stringify(requests));

        // Retrieve user profile from localStorage using email
        let userEmail = requests[index].email;
        let users = JSON.parse(localStorage.getItem('users'));
        console.log(users);
        let userIndex = users.findIndex(user => user.email === userEmail);

        if (userIndex !== -1) {
            // Create a new connection object
            let connection = {
                connect_id: requests[index].connect_id,
                address: `${requests[index].houseFlat}, ${requests[index].houseName}, ${requests[index].locality}, ${requests[index].city}, ${requests[index].district}, ${requests[index].state}`,
                loadType: requests[index].loadType,
                meterType: requests[index].meterType,
                status: "Approved"
            };

            // Initialize the connections array if it doesn't exist
            if (!users[userIndex].connections) {
                users[userIndex].connections = [];
            }

            // Add the new connection to the user's connections array
            users[userIndex].connections.push(connection);

            // Update localStorage with the modified users array
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            console.error('User not found in localStorage.');
        }

    } else {
        console.error('Request not found in localStorage.');
    }
    displayConnectionRequests();
};
function reject(reqid) {
    let requests = JSON.parse(localStorage.getItem('requests'));
    // Find the index of the request to be rejected based on its connect_id
    let index = requests.findIndex(request => request.connect_id === reqid);

    if (index !== -1) {
        // Update the status of the request to "Rejected"
        requests[index].applStatus = "Rejected";

        let reason = prompt("Enter reason for rejection:");
        // Add the rejection reason
        requests[index].reason = reason;

        // Update localStorage with the modified requests array
        localStorage.setItem('requests', JSON.stringify(requests));

        // Retrieve user profile from localStorage using email
        let userEmail = requests[index].email;
        let users = JSON.parse(localStorage.getItem('users'));
        let userIndex = users.findIndex(user => user.email === userEmail);

        if (userIndex !== -1) {
            // Create a new connection object
            let connection = {
                connect_id: requests[index].connect_id,
                address: `${requests[index].houseFlat}, ${requests[index].houseName}, ${requests[index].locality}, ${requests[index].city}, ${requests[index].district}, ${requests[index].state}`,
                loadType: requests[index].loadType,
                meterType: requests[index].meterType,
                status: "Rejected",
                reason: rejectionReason
            };

            // Initialize the connections array if it doesn't exist
            if (!users[userIndex].connections) {
                users[userIndex].connections = [];
            }

            // Add the new connection to the user's connections array
            users[userIndex].connections.push(connection);

            // Update localStorage with the modified users array
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            console.error('User not found in localStorage.');
        }

    } else {
        console.error('Request not found in localStorage.');
    }
    displayConnectionRequests();
}



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

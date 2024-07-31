// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    loadComplaints();
    applyThemeFromLocalStorage();
});

function checkLoggedInUser() {
    // Check if there is a logged-in user in localStorage
    const currentUser = localStorage.getItem('adminLogin');

    if (!currentUser) {
        // If no user is logged in, redirect to the login page
        window.location.href = 'admin_login.html';
    }
}

// function to handle logout
function logoutUser() {
    localStorage.removeItem('adminLogin'); // remove current user data
}

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = 'admin_login.html';
});

function loadComplaints(){
    const complaintsTableBody = document.getElementById('complaints-table-body');
    const resolveModal = new bootstrap.Modal(document.getElementById('resolveModal'));
    const resolveForm = document.getElementById('resolveForm');
    const resolutionInput = document.getElementById('resolution');

    // Function to render complaints table
    function renderComplaintsTable() {
        complaintsTableBody.innerHTML = ''; // Clear existing rows

        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        complaints.forEach((complaint, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${complaint.name}</td>
                <td>${complaint.email}</td>
                <td>${complaint.number}</td>
                <td>${complaint.issueType}</td>
                <td>${complaint.description}</td>
                <td>${complaint.ticketStatus}</td>
                <td>
                    <button class="btn btn-primary resolve-btn" data-index="${index}">Resolve</button>
                </td>
            `;
            complaintsTableBody.appendChild(row);

            // Add event listener for resolve button
            const resolveBtn = row.querySelector('.resolve-btn');
            resolveBtn.addEventListener('click', function() {
                // Open the resolve modal
                resolveModal.show();

                // Submit resolution form for this complaint
                resolveForm.onsubmit = function(event) {
                    event.preventDefault();
                    const resolution = resolutionInput.value.trim();

                    if (resolution !== '') {
                        // Update complaint object with resolution and status
                        complaint.resolution = resolution;
                        complaint.ticketStatus = 'closed';

                        // Update localStorage with updated complaints array
                        localStorage.setItem('complaints', JSON.stringify(complaints));

                        // Close modal
                        resolveModal.hide();

                        // Re-render the table to reflect changes
                        renderComplaintsTable();
                    } else {
                        alert('Please enter a resolution for this complaint.');
                    }
                };
            });
        });
        applyThemeFromLocalStorage();
    }
    // Initial rendering of complaints table
    renderComplaintsTable();
}

// Function to apply dark mode classes and specific styles to an element and its children
function applyDarkModeStyles(element) {
    // Add bg-dark and text-light classes to all elements
    element.classList.add('bg-dark', 'text-light');

    // Apply specific styles to anchors and buttons
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#87cefa', 'important'); // Change link color with !important
    } else if (element.tagName === 'BUTTON') {
        element.style.setProperty('background-color', '#000000', 'important'); // Change button background color with !important
    }

    // Recursively apply styles to all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        applyDarkModeStyles(children[i]);
    }
}

// Function to remove dark mode classes and specific styles from an element and its children
function removeDarkModeStyles(element) {
    // Remove bg-dark and text-light classes from all elements
    element.classList.remove('bg-dark', 'text-light');

    // Remove specific styles from anchors and buttons
    if (element.tagName === 'A') {
        element.style.removeProperty('color'); // Remove custom link color
    } else if (element.tagName === 'BUTTON') {
        element.style.removeProperty('background-color'); // Reset button background color to default
    }

    // Recursively remove styles from all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        removeDarkModeStyles(children[i]);
    }
}

// Function to enable dark mode
function enableDarkMode() {
    applyDarkModeStyles(document.body);
    localStorage.setItem('theme', 'dark-mode');
}

// Function to disable dark mode
function disableDarkMode() {
    removeDarkModeStyles(document.body);
    localStorage.setItem('theme', 'light-mode');
}

// Function to toggle between light and dark mode
function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark-mode') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Function to check localStorage and apply theme accordingly
function applyThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        enableDarkMode();
    } else {
        disableDarkMode(); // Default to light mode
    }
}

// Example usage: Toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});

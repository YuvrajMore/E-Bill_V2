// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    feedbackValidate();
    applyThemeFromLocalStorage();
});

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
function feedbackValidate() {
    const feedbackForm = document.getElementById('feedback_form');

    // Event listener for form submission
    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Reset warnings from previous submissions
        document.getElementById('type_warn').innerHTML = "";
        document.getElementById('descr_warn').innerHTML = "";

        // Fetching form inputs
        const issueType = document.querySelector('input[name="issue-type"]:checked');
        const description = document.getElementById('description');
        const fileAttachment = document.getElementById('file_attachment');

        // Validating form inputs
        let isValid = true;

        if (!issueType) {
            document.getElementById('type_warn').innerHTML = "Please select an issue type.";
            isValid = false;
        }

        if (description.value.trim() === '') {
            document.getElementById('descr_warn').innerHTML = "Please describe your issue.";
            isValid = false;
        }

        // If form inputs are valid, process the submission
        if (isValid) {
            // Get current user data from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (currentUser) {
                const complaint = {
                    name: currentUser.fname + ' ' + currentUser.lname, // Combine first and last name
                    email: currentUser.email,
                    number: currentUser.number,
                    issueType: issueType.value,
                    description: description.value.trim(),
                    ticketStatus: 'open' // Default ticket status
                };

                // Store complaint in localStorage
                let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
                complaints.push(complaint);

                localStorage.setItem('complaints', JSON.stringify(complaints));
                window.location.href="homepage.html";
                feedbackForm.reset(); // Reset the form after successful submission
            } else {
                alert('Current user data not found. Please log in or provide user details.');
            }
        }
    });

    // Event listener to clear validation warnings on input focus
    const issueTypeRadios = document.querySelectorAll('input[name="issue-type"]');
    issueTypeRadios.forEach(radio => {
        radio.addEventListener('focus', function () {
            document.getElementById('type_warn').innerHTML = "";
        });
    });

    const descriptionTextarea = document.getElementById('description');
    descriptionTextarea.addEventListener('focus', function () {
        document.getElementById('descr_warn').innerHTML = "";
    });
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
        disableDarkMode(); // default light mode
    }
}

// toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});
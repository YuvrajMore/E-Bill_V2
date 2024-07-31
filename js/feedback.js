// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    applyThemeFromLocalStorage();
    feedbackValidate();
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

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = '../index.html';
});

function feedbackValidate() {
    const feedbackForm = document.getElementById('feedback_form');

    // Event listener for form submission
    feedbackForm.addEventListener('reset', function (event) {
        document.getElementById('rating_warn').innerHTML = "";
        document.getElementById('descr_warn').innerHTML = "";
    });

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Reset warnings from previous submissions
        document.getElementById('rating_warn').innerHTML = "";
        document.getElementById('descr_warn').innerHTML = "";

        // Fetching form inputs
        const rating = document.querySelector('input[name="rating"]:checked');
        const description = document.getElementById('description');

        // Validating form inputs
        let isValid = true;

        if (!rating) {
            document.getElementById('rating_warn').innerHTML = "Please select a rating.";
            isValid = false;
        }

        if (description.value.trim() === '') {
            document.getElementById('descr_warn').innerHTML = "Please describe your experience.";
            isValid = false;
        }

        // If form inputs are valid, process the submission
        if (isValid) {
            // Get current user data from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (currentUser) {
                const { fname, lname, email, number } = currentUser;

                // Determine feedback rating in words
                let ratingText;
                switch (rating.value) {
                    case 'excellent':
                        ratingText = 'Excellent';
                        break;
                    case 'very_good':
                        ratingText = 'Very Good';
                        break;
                    case 'good':
                        ratingText = 'Good';
                        break;
                    case 'fair':
                        ratingText = 'Fair';
                        break;
                    case 'poor':
                        ratingText = 'Poor';
                        break;
                    default:
                        ratingText = 'Unknown';
                }

                // Store feedback in localStorage
                const feedback = {
                    name: fname + ' ' + lname,
                    email: email,
                    number: number,
                    rating: {
                        value: rating.value,
                        text: ratingText
                    },
                    description: description.value.trim()
                };

                // Retrieve existing feedbacks from localStorage or initialize if null
                let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
                feedbacks.push(feedback);

                // Update feedbacks in localStorage
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

                let totalRating = 0;
                let validFeedbackCount = 0;

                feedbacks.forEach(fb => {
                    // Check if fb.rating exists and is not undefined
                    if (fb.rating && fb.rating.value) {
                        switch (fb.rating.value) {
                            case 'excellent':
                                totalRating += 5;
                                break;
                            case 'very_good':
                                totalRating += 4;
                                break;
                            case 'good':
                                totalRating += 3;
                                break;
                            case 'fair':
                                totalRating += 2;
                                break;
                            case 'poor':
                                totalRating += 1;
                                break;
                        }
                        validFeedbackCount++;
                    }
                });

                // Calculate average only if there are valid feedbacks
                const overallRatingAverage = validFeedbackCount > 0 ? totalRating / validFeedbackCount : 0;

                // Store overall feedback rating average in localStorage
                localStorage.setItem('overallFeedback', overallRatingAverage);

                // Optionally, display a success message or perform other actions
                feedbackForm.reset(); // Reset the form after successful submission
                window.location.href = "homepage.html";
            } else {
                alert('Current user data not found. Please log in or provide user details.');
            }
        }
    });

    // Event listener to clear validation warnings on input focus
    const excellentRadio = document.getElementById('excellent');
    excellentRadio.addEventListener('focus', function () {
        document.getElementById('rating_warn').innerHTML = "";
    });

    const veryGoodRadio = document.getElementById('very_good');
    veryGoodRadio.addEventListener('focus', function () {
        document.getElementById('rating_warn').innerHTML = "";
    });

    const goodRadio = document.getElementById('good');
    goodRadio.addEventListener('focus', function () {
        document.getElementById('rating_warn').innerHTML = "";
    });

    const fairRadio = document.getElementById('fair');
    fairRadio.addEventListener('focus', function () {
        document.getElementById('rating_warn').innerHTML = "";
    });

    const poorRadio = document.getElementById('poor');
    poorRadio.addEventListener('focus', function () {
        document.getElementById('rating_warn').innerHTML = "";
    });

    const descriptionTextarea = document.getElementById('description');
    descriptionTextarea.addEventListener('focus', function () {
        document.getElementById('descr_warn').innerHTML = "";
    });
};
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

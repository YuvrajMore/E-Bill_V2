// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
    checkUserConnectionId();
    applyThemeFromLocalStorage();
    populateConnectionAndBillSelects();
    loadPaymentMethods();
});

// apply theme based on localStorage when the document loads

function checkUserConnectionId() {
    const currentUserEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    const connections = JSON.parse(localStorage.getItem('requests')) || [];

    // Check if there is at least one approved connection for the current user
    const hasApprovedConnection = connections.some(connection => {
        return connection.email === currentUserEmail && connection.applStatus === 'Approved';
    });

    if (!hasApprovedConnection) {
        const form = document.getElementById('pay_form');
        form.innerHTML = "<h4>Please apply for a new connection first.</h4>";
    }
}

function checkLoggedInUser() {
    // check if there is a logged-in user in localStorage
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        // if no user is logged in, redirect to the login page
        window.location.href = '../index.html';
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
    window.location.href = 'homepage.html';
});

function populateConnectionAndBillSelects() {
    // Retrieve current user's email from localStorage
    let currentUserEmail = JSON.parse(localStorage.getItem('currentUser')).email;

    // Retrieve requests from localStorage
    let requests = JSON.parse(localStorage.getItem('requests')) || [];

    // Filter requests to get only approved requests of the current user
    let approvedRequests = requests.filter(request => {
        return request.email === currentUserEmail && request.applStatus === 'Approved';
    });

    // Populate Connection ID select options
    let connectIdSelect = document.getElementById('connection_id');
    connectIdSelect.innerHTML = '<option value="" disabled selected>Select your Connection ID</option>';
    approvedRequests.forEach(request => {
        let option = document.createElement('option');
        option.value = request.connect_id;
        option.textContent = request.connect_id;
        connectIdSelect.appendChild(option);
    });

    // Event listener for when Connection ID selection changes
    connectIdSelect.addEventListener('change', function () {
        let selectedConnectId = connectIdSelect.value;
        populateBillNumbers(parseInt(selectedConnectId));
    });

    function populateBillNumbers(connectId) {
        // Clear previous options
        const billNoSelect = document.getElementById('bill_no');
        billNoSelect.innerHTML = '<option value="" disabled selected>Select your bill number</option>';

        // Find the request object corresponding to the selected connectId
        let selectedRequest = approvedRequests.filter(request => {
            return request.connect_id === connectId;
        });
        const bills = selectedRequest[0].bills;

        // Populate bill numbers for the selected connection ID
        let billCount = 0;
        bills.forEach(bill => {
            if(bill.status != "Paid"){
                billCount++;
                const option = document.createElement('option');
                option.value = bill.billNumber;
                option.textContent = bill.billNumber;
                billNoSelect.appendChild(option);
            }
        });
        if(billCount===0){
            billNoSelect.innerHTML = '<option value="" disabled selected>No pending bills for this connection.</option>';
        }
    }
    const billNoSelect = document.getElementById('bill_no');
    billNoSelect.addEventListener('change', function () {
        let selectedBillNo = parseInt(billNoSelect.value);
        console.log(selectedBillNo);

        // Retrieve the requests data from localStorage
        let requests = JSON.parse(localStorage.getItem('requests'));
        console.log(requests);

        // Initialize variable to store the selected bill amount
        let selectedBillAmount = null;

        // Iterate through each connection object in the requests array
        for (let i = 0; i < requests.length; i++) {
            let connection = requests[i];
            let bill = {};
            // Find the bill object with the selected bill number in the bills array of this connection
            if(Object.hasOwn(connection,'bills')){
                bill = connection.bills.find(bill => bill.billNumber === selectedBillNo);
            }

            // If the bill is found, store its amount and break out of the loop
            if (bill) {
                selectedBillAmount = bill.amount;
                break;
            }else {
                console.log(`Bill not found - ${selectedBillNo}`);
            }
        }

        // Display the selected bill amount if found, otherwise handle as needed
        if (selectedBillAmount !== null) {
            document.getElementById('bill_amount').innerHTML = `Bill Amount: ${selectedBillAmount} RS.`;
        } else {
            document.getElementById('bill_amount').innerHTML = 'Bill not found';
        }
    });
}

const upiRadio = document.getElementById('upi');
const cardRadio = document.getElementById('card');
const upiDetails = document.getElementById('upi_details');
const cardDetails = document.getElementById('card_details');

// Event listener for radio button change
upiRadio.addEventListener('change', function () {
    if (upiRadio.checked) {
        // Show UPI ID input and hide card details
        upiDetails.classList.remove('d-none');
        cardDetails.classList.add('d-none');
    }
});

cardRadio.addEventListener('change', function () {
    if (cardRadio.checked) {
        // Show card details input and hide UPI ID
        upiDetails.classList.add('d-none');
        cardDetails.classList.remove('d-none');
    }
});

// Validation functions
function validateUPI() {
    const upiId = document.getElementById('upi_id').value.trim();
    if (upiId === '') {
        document.getElementById('upi_id').classList.add('is-invalid');
        document.getElementById('upi_id_feedback').innerHTML = 'Please enter your UPI ID.';
        return false;
    }
    return true;
}

function validateCardDetails() {
    const cardNumber = document.getElementById('card_number').value.trim();
    const cardExpiry = document.getElementById('card_expiry').value.trim();
    const cardCVV = document.getElementById('card_cvv').value.trim();
    const cardName = document.getElementById('card_name').value.trim();

    if (cardNumber === '') {
        document.getElementById('card_number').classList.add('is-invalid');
        document.getElementById('card_number_feedback').innerHTML = 'Please enter your card number.';
        return false;
    }
    if (cardExpiry === '') {
        document.getElementById('card_expiry').classList.add('is-invalid');
        document.getElementById('card_expiry_feedback').innerHTML = 'Please enter card expiry.';
        return false;
    }
    if (cardCVV === '') {
        document.getElementById('card_cvv').classList.add('is-invalid');
        document.getElementById('card_cvv_feedback').innerHTML = 'Please enter CVV.';
        return false;
    }
    if (cardName === '') {
        document.getElementById('card_name').classList.add('is-invalid');
        document.getElementById('card_name_feedback').innerHTML = 'Please enter name on card.';
        return false;
    }
    return true;
}

document.getElementById('pay_form').addEventListener('submit', function (event) {
    event.preventDefault();

    let selectedConnectionID = document.getElementById('connection_id').value;
    let selectedBillNo = document.getElementById('bill_no').value;
    let paymentMethod = '';

    if (upiRadio.checked) {
        // Validate UPI ID
        if (validateUPI()) {
            paymentMethod = 'UPI';
            // Process payment and update bill in localStorage
            processPayment(selectedBillNo, selectedConnectionID, paymentMethod);
        }
    } else if (cardRadio.checked) {
        // Validate card details
        if (validateCardDetails()) {
            paymentMethod = 'Card Payment';
            // Process payment and update bill in localStorage
            processPayment(selectedBillNo, selectedConnectionID, paymentMethod);
        }
    } else {
        document.getElementById('method_warn').innerHTML = "Please select a payment method.";
    }
});

function loadPaymentMethods() {
    const form = document.getElementById('pay_form');
    const connectionIdSelect = document.getElementById('connection_id');
    const billNoSelect = document.getElementById('bill_no');

    // Event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Validate form fields
        if (!validateForm()) {
            return;
        }
    });

    // Event listener for radio button change (payment method)
    const upiRadio = document.getElementById('upi');
    const cardRadio = document.getElementById('card');
    const upiDetails = document.getElementById('upi_details');
    const cardDetails = document.getElementById('card_details');

    upiRadio.addEventListener('change', function () {
        document.getElementById('method_warn').innerHTML = "";
        if (upiRadio.checked) {
            showUPIFields();
        }
    });

    cardRadio.addEventListener('change', function () {
        if (cardRadio.checked) {
            showCardFields();
        }
    });

    // Function to show UPI fields and hide card fields
    function showUPIFields() {
        upiDetails.classList.remove('d-none');
        cardDetails.classList.add('d-none');
    }

    // Function to show card fields and hide UPI fields
    function showCardFields() {
        upiDetails.classList.add('d-none');
        cardDetails.classList.remove('d-none');
    }

    // Validation function for the form
    function validateForm() {
        let isValid = true;

        // Reset validation messages
        resetValidationMessages();

        // Validate connection ID
        if (connectionIdSelect.value === '') {
            isValid = false;
            document.getElementById('connection_id_feedback').innerHTML = 'Please select a connection ID.';
        }

        // Validate bill number
        if (billNoSelect.value === '' || billNoSelect.value === null) {
            isValid = false;
            document.getElementById('bill_no_feedback').innerHTML = 'Please select a bill number.';
        }

        // Validate payment method
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
        if (!paymentMethod) {
            isValid = false;
            document.getElementById('method_warn').innerHTML = "Please select a payment method.";
            return isValid;
        }

        // Validate UPI ID if selected
        if (paymentMethod.value === 'UPI') {
            const upiId = document.getElementById('upi_id').value.trim();
            if (upiId === '') {
                isValid = false;
                document.getElementById('upi_id_feedback').innerHTML = 'Please enter your UPI ID.';
            }
        }

        // Validate card details if selected
        if (paymentMethod.value === 'Card Payment') {
            const cardNumber = document.getElementById('card_number').value.trim();
            if (cardNumber === '') {
                isValid = false;
                document.getElementById('card_number_feedback').innerHTML = 'Please enter your card number.';
            }

            const cardExpiry = document.getElementById('card_expiry').value.trim();
            if (cardExpiry === '') {
                isValid = false;
                document.getElementById('card_expiry_feedback').innerHTML = 'Please enter card expiry.';
            }

            const cardCVV = document.getElementById('card_cvv').value.trim();
            if (cardCVV === '') {
                isValid = false;
                document.getElementById('card_cvv_feedback').innerHTML = 'Please enter CVV.';
            }

            const cardName = document.getElementById('card_name').value.trim();
            if (cardName === '') {
                isValid = false;
                document.getElementById('card_name_feedback').innerHTML = 'Please enter name on card.';
            }
        }

        return isValid;
    }

    // Function to reset validation messages
    function resetValidationMessages() {
        const feedbackElements = document.querySelectorAll('.text-danger');
        feedbackElements.forEach(element => {
            element.innerHTML = '';
        });
    }
};

// Function to process payment and update bill in localStorage
function processPayment(selectedBillNo, selectedConnectionID, paymentMethod) {
    // Retrieve requests data from localStorage
    let requests = JSON.parse(localStorage.getItem('requests'));
    // Find the connection object based on connect_id (if needed)
    let connection = requests.find(conn => conn.connect_id === parseInt(selectedConnectionID));
    console.log(connection);
    // Find the bill object with the selected bill number
    let billToUpdate = connection.bills.find(bill => bill.billNumber === parseInt(selectedBillNo));
    // Update bill properties
    if (billToUpdate) {
        billToUpdate.status = 'Paid';
        billToUpdate.dateOfPayment = new Date().toLocaleDateString();
        billToUpdate.paymentMethod = paymentMethod;

        // Update localStorage
        localStorage.setItem('requests', JSON.stringify(requests));

        // Confirmation message or further processing
        console.log('Payment successful! Bill updated:', billToUpdate);
        window.location.href='homepage.html';
    } else {
        console.error('Selected bill not found.');
    }
}


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
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
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
        disableDarkMode(); // default light mode
    }
}

document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});
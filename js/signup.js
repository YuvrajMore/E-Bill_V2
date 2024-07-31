// apply theme based on localStorage when the document loads
applyThemeFromLocalStorage();

document.getElementById('togglePassword').addEventListener('click', function (event) {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    document.getElementById('eye').classList.toggle('fa-eye');
    document.getElementById('eye').classList.toggle('fa-eye-slash');
});

// function to apply dark mode styles
function applyDarkModeStyles(element) {
    if (element.tagName === 'INPUT' && element.classList.contains('form-check-input')) {
        return;
    }
    element.classList.add('bg-dark', 'text-light');
    element.classList.remove('bg-light', 'text-dark');

    // apply specific styles to anchors and buttons
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#87cefa', 'important'); // change link color with !important
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'INPUT' && element.id === 'signup_btn') {
        element.style.removeProperty('background-color'); // change button background color with !important
    } else if (element.tagName === 'INPUT') {
        element.style.setProperty('color', 'white', 'important'); // change input text color with !important
    }
    // recursively apply styles to all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        applyDarkModeStyles(children[i]);
    }
}

// function to remove dark mode styles
function removeDarkModeStyles(element) {
    if (element.tagName === 'INPUT' && element.classList.contains('form-check-input')) {
        return;
    }
    element.classList.remove('bg-dark', 'text-light');
    element.classList.add('bg-light', 'text-dark');

    // remove specific styles from anchors and buttons
    if (element.tagName === 'INPUT' && element.id === 'signup_btn') {
        element.style.setProperty('background-color', '#0ea2bc', 'important');
        element.style.setProperty('border-color', '#0ea2bc', 'important');
        element.style.setProperty('color', '#FFFFFF', 'important');
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'A') {
        element.style.setProperty('color', '#0ea2bc', 'important');
    } else if (element.tagName === 'INPUT') {
        element.style.setProperty('color', '#000000', 'important');
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
};


// Example usage: Toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});

document.getElementById('signupForm').addEventListener('reset', function(event){
    document.getElementById('fname_warn').innerHTML="";
    document.getElementById('lname_warn').innerHTML="";
    document.getElementById('pwd_warn').innerHTML="";
    document.getElementById('email_warn').innerHTML="";
    document.getElementById('num_warn').innerHTML="";
    document.getElementById('house_no_warn').innerHTML="";
    document.getElementById('house_name_warn').innerHTML="";
    document.getElementById('locality_warn').innerHTML="";
    document.getElementById('city_warn').innerHTML="";
    document.getElementById('district_warn').innerHTML="";
    document.getElementById('state_warn').innerHTML="";
})

document.getElementById('fname').addEventListener('input',function(){
    document.getElementById('fname_warn').innerHTML="";
});
document.getElementById('lname').addEventListener('input',function(){
    document.getElementById('lname_warn').innerHTML="";
});
document.getElementById('password').addEventListener('input', function(){
    document.getElementById('pwd_warn').innerHTML="";
});
document.getElementById('email').addEventListener('input', function(){
    document.getElementById('email_warn').innerHTML="";
});
document.getElementById('number').addEventListener('input', function(){
    document.getElementById('num_warn').innerHTML="";
});
document.getElementById('house-flat').addEventListener('input', function(){
    document.getElementById('house_no_warn').innerHTML="";
});
document.getElementById('house-name').addEventListener('input', function(){
    document.getElementById('house_name_warn').innerHTML="";
});
document.getElementById('locality').addEventListener('input', function(){
    document.getElementById('locality_warn').innerHTML="";
});
document.getElementById('city').addEventListener('input', function(){
    document.getElementById('city_warn').innerHTML="";
});
document.getElementById('district').addEventListener('input', function(){
    document.getElementById('district_warn').innerHTML="";
});
document.getElementById('state').addEventListener('input', function(){
    document.getElementById('state_warn').innerHTML="";
});

document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    const passwordField = document.getElementById('password');
    if (passwordField.getAttribute('type') === 'text') {
        passwordField.setAttribute('type', 'password');
    }

    var fname = document.getElementById('fname').value.trim();
    var lname = document.getElementById('lname').value.trim();
    var password = document.getElementById('password').value.trim();
    var email = document.getElementById('email').value.trim();
    var number = document.getElementById('number').value.trim();
    var houseFlat = document.getElementById('house-flat').value.trim();
    var houseName = document.getElementById('house-name').value.trim();
    var locality = document.getElementById('locality').value.trim();
    var city = document.getElementById('city').value.trim();
    var district = document.getElementById('district').value.trim();
    var state = document.getElementById('state').value.trim();

    var fnamePattern = /[a-zA-Z]{3,}/;
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s.]+(?:\.[^@\s.]+)*$/;
    var numberPattern = /[0-9]{10}/;
    var houseFlatPattern = /[0-9]*/;
    var houseNamePattern = /[a-zA-Z0-9\s]*/;
    var localityPattern = /[a-zA-Z0-9\s]*/;
    var cityPattern = /[a-zA-Z\s]*/;
    var districtPattern = /[a-zA-Z\s]*/;
    var statePattern = /[a-zA-Z\s]*/;

    var empty = false;

    // Validate each field against its pattern
    if (!fnamePattern.test(fname)) {
        document.getElementById('fname_warn').innerHTML="Please enter a valid first name. Use only alphabets.";
        empty=true;
    }
    if (!fnamePattern.test(lname)) {
        document.getElementById('lname_warn').innerHTML="Please enter a valid last name. Use only alphabets.";
        empty=true;
    }
    if (!passwordPattern.test(password)) {
        document.getElementById('pwd_warn').innerHTML="Please choose a password with atleast 8 characters, include atleast one number, one uppercase letter, one lowercase letter and one special character.";
        empty=true;
    }
    if (!emailPattern.test(email)) {
        document.getElementById('email_warn').innerHTML="Please enter a valid email address. Use exactly one @ sign and one fullstop.";
        empty=true;
    }
    if (!numberPattern.test(number)) {
        document.getElementById('num_warn').innerHTML="Please enter a contact number having 10 digits.";
        empty=true;
    }
    if (!houseFlatPattern.test(houseFlat) || houseFlat==="") {
        document.getElementById('house_no_warn').innerHTML="Please enter house/flat/plot no. Use only numbers.";
        empty=true;
    }
    if (!houseNamePattern.test(houseName) || houseName==="") {
        document.getElementById('house_name_warn').innerHTML="Please enter house/building name. Use only alphabets or numbers.";
        empty=true;
    }
    if (!localityPattern.test(locality) || locality==="") {
        document.getElementById('locality_warn').innerHTML="Please enter name of locality. Use only alphabets.";
        empty=true;
    }
    if (!cityPattern.test(city) || city==="") {
        document.getElementById('city_warn').innerHTML="Please enter name of city. Use only alphabets.";
        empty=true;
    }
    if (!districtPattern.test(district) || district==="") {
        document.getElementById('district_warn').innerHTML="Please enter name of district. Use only alphabets.";
        empty=true;
    }
    if (!statePattern.test(state) || state==="") {
        document.getElementById('state_warn').innerHTML="Please enter name of state. Use only alphabets.";
        empty=true;
    }
    if(empty) return;

    var user = {
        fname: fname,
        lname: lname,
        password: password,
        email: email,
        number: number,
        houseFlat: houseFlat,
        houseName: houseName,
        locality: locality,
        city: city,
        district: district,
        state: state,
    };

    // check if users array already exists in localStorage
    var allUsers = JSON.parse(localStorage.getItem('users')) || [];

    var existingUser = allUsers.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        // alert("Email already exists. Please use a different one.");
        return false;
    }

    // add new user to the array
    allUsers.push(user);
    // save updated allUsers array back to localStorage
    localStorage.setItem('users', JSON.stringify(allUsers));

    // alert("You have successfully registered on E-Bill portal! You can now login using your email and password.");
    // redirect to login page
    window.location.href = "../index.html";
    return false; // prevent form submission
});
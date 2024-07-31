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
    } else if (element.tagName === 'INPUT' && element.id === 'login_btn') {
        element.style.removeProperty('background-color'); // change button background color with !important
    } else if (element.tagName === 'INPUT' && element.classList.contains('form-check-input')) {
        element.style.setProperty('border-color', '#ffffff', 'important');
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
    if (element.tagName === 'INPUT' && element.id === 'login_btn') {
        element.style.setProperty('background-color', '#0ea2bc', 'important');
        element.style.setProperty('border-color', '#0ea2bc', 'important');
        element.style.setProperty('color', '#FFFFFF', 'important');
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
    } else if (element.tagName === 'A') {
        element.style.setProperty('color', '#0ea2bc', 'important');
    } else if (element.tagName === 'INPUT' && element.classList.contains('form-check-input')) {
        element.style.setProperty('border-color', '#000000', 'important');
    } else if (element.tagName === 'INPUT') {
        element.style.setProperty('color', 'black', 'important');
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
};

//toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
    toggleTheme();
});

document.getElementById('email').addEventListener('input', function(){
    document.getElementById('email_warn').innerHTML="";
})
document.getElementById('password').addEventListener('input', function(){
    document.getElementById('pwd_warn').innerHTML="";
})


document.getElementById('login_form').addEventListener('submit', function (event) {
    event.preventDefault(); // prevent form submission
    const passwordField = document.getElementById('password');
    if (passwordField.getAttribute('type') === 'text') {
        passwordField.setAttribute('type', 'password');
    }

    // get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const emailPattern =  /^[^@\s]+@[^@\s]+\.[^@\s.]+(?:\.[^@\s.]+)*$/;

    if(!(emailPattern.test(email))){
        // if email doesnt contain @ symbol, then display warning.
        document.getElementById('email_warn').innerHTML="Please enter a valid email address.";
        document.getElementById('email').focus(); // focus on email
    }
    if (email===''){
        // if email field is empty
        document.getElementById('email_warn').innerHTML="You need to enter your registered email address.";
        document.getElementById('email').focus();
    }
    if(password===''){
        // if password is empty
        document.getElementById('pwd_warn').innerHTML="You need to enter your password created during sign up.";
        if (email!=='' && !(email.indexOf('@')==-1)){
            document.getElementById('password').focus();
        }
    }

    // const pwdPattern="[^\s@]+@[^\s@]+\.[^\s@]+";

    // retrieve users data from localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];

    // check if there is a user with the provided email and password
    var loggedInUser = users.find(function (user) {
        return user.email === email && user.password === password;
    });

    if (loggedInUser) {
        // 'currentUser' is the key used to store the logged-in user
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

        // user found, proceed to login
        // alert('Login successful!');

        // redirect to homepage.html
        window.location.href = 'html/homepage.html';
    } else {
        // incorrect credentials
        document.getElementById('pwd_warn').innerHTML="Please enter correct email and password.";
    }
});
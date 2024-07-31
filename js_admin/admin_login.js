// apply theme based on localStorage when the document loads
applyThemeFromLocalStorage();

document.getElementById('togglePassword').addEventListener('click', function (event) {
  const passwordField = document.getElementById('password');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  document.getElementById('eye').classList.toggle('fa-eye');
  document.getElementById('eye').classList.toggle('fa-eye-slash');
});

document.getElementById('password').addEventListener('input', function(){
  document.getElementById('pwd_warn').innerHTML="";
});

document.getElementById('login_form').addEventListener('submit', function (event) {
  event.preventDefault(); // prevent form submission

  // get form values
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();
  if(password===""){
    document.getElementById('pwd_warn').innerHTML="Please enter a password.";
    document.getElementById('password').focus();
  }

  if (email === "admin@bill.com" && password === "Admin@1234") {
    // set admin login to true
    localStorage.setItem("adminLogin", "TRUE");
    // redirect to homepage.html
    window.location.href = 'mainpage.html';
  } else {
    //alert('Incorrect email or password. Please try again.');
    return;
  }
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
    element.style.setProperty('color', '#87cefa', 'important'); // Change link color with !important
  } else if (element.tagName === 'SMALL') {
    element.style.setProperty('color', 'red', 'important');
  } else if (element.tagName === 'INPUT' && element.id === 'login_btn') {
    element.style.removeProperty('background-color'); // Change button background color with !important
  } else if (element.tagName === 'INPUT' && element.classList.contains('form-check-input')) {
    element.style.setProperty('border-color', '#ffffff', 'important');
  } else if (element.tagName === 'INPUT') {
    element.style.setProperty('color', 'white', 'important'); // Change input text color with !important
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

// toggle theme when a button with id="toggle-theme-button" is clicked
document.getElementById('toggle-theme-button').addEventListener('click', function () {
  toggleTheme();
});
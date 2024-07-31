// call the function when the page loads to enforce checking
document.addEventListener('DOMContentLoaded', function () {
    checkLoggedInUser();
});

// apply theme based on localStorage when the document loads
applyThemeFromLocalStorage();

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
    // remove current user session data
    localStorage.removeItem('currentUser');
}

// event listener for logout button
document.getElementById('logout_btn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent default action of anchor click

    logoutUser(); // call logout function

    // redirect to index.html after logout
    window.location.href = '../index.html';
});

document.getElementById('useProfileAddress').addEventListener('change', function () {
    const isChecked = this.checked;
    const addressFields = document.getElementById('addressFields');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (isChecked) {
        addressFields.style.display = 'none';

        document.getElementById('house-flat').value = currentUser.houseFlat;
        document.getElementById('house-name').value = currentUser.houseName;
        document.getElementById('locality').value = currentUser.locality;
        document.getElementById('city').value = currentUser.city;
        document.getElementById('district').value = currentUser.district;
        document.getElementById('state').value = currentUser.state;
    } else {
        addressFields.style.display = 'block';

        document.getElementById('house-flat').value = '';
        document.getElementById('house-name').value = '';
        document.getElementById('locality').value = '';
        document.getElementById('city').value = '';
        document.getElementById('district').value = '';
        document.getElementById('state').value = '';
    }
});

document.getElementById('house-flat').addEventListener('input', function () {
    document.getElementById('house_no_warn').innerHTML = "";
});
document.getElementById('house-name').addEventListener('input', function () {
    document.getElementById('house_name_warn').innerHTML = "";
});
document.getElementById('locality').addEventListener('input', function () {
    document.getElementById('locality_warn').innerHTML = "";
});
document.getElementById('city').addEventListener('input', function () {
    document.getElementById('city_warn').innerHTML = "";
});
document.getElementById('district').addEventListener('input', function () {
    document.getElementById('district_warn').innerHTML = "";
});
document.getElementById('state').addEventListener('input', function () {
    document.getElementById('state_warn').innerHTML = "";
});
document.getElementById('residential').addEventListener('input', function () {
    document.getElementById('meter_warn').innerHTML = "";
});
document.getElementById('commercial').addEventListener('input', function () {
    document.getElementById('meter_warn').innerHTML = "";
});
document.getElementById('single-phase').addEventListener('input', function () {
    document.getElementById('load_warn').innerHTML = "";
});
document.getElementById('three-phase').addEventListener('input', function () {
    document.getElementById('load_warn').innerHTML = "";
});
document.getElementById("doc").addEventListener("click", function () {
    document.getElementById("file_warn").innerHTML = "";
});

document.getElementById('new_connect_form').addEventListener('submit', function (event) {
    event.preventDefault(); // prevent form submission

    var this_user = JSON.parse(localStorage.getItem('currentUser'));
    var fname = this_user.fname;
    var lname = this_user.lname;
    var email = this_user.email;
    var number = this_user.number;
    var useProfileAddress = document.getElementById('useProfileAddress').checked;
    var houseFlat, houseName, locality, city, district, state;

    if (useProfileAddress) {
        houseFlat = this_user.houseFlat;
        houseName = this_user.houseName;
        locality = this_user.locality;
        city = this_user.city;
        district = this_user.district;
        state = this_user.state;
    } else {
        houseFlat = document.getElementById('house-flat').value.trim();
        houseName = document.getElementById('house-name').value.trim();
        locality = document.getElementById('locality').value.trim();
        city = document.getElementById('city').value.trim();
        district = document.getElementById('district').value.trim();
        state = document.getElementById('state').value.trim();
    }

    var loadType = getLoadSelect();
    console.log(loadType);
    var meterType = getMeterSelect();
    console.log(meterType);
    var file = document.getElementById('doc').files[0];
    console.log(file);

    function getMeterSelect() {
        var type = null;
        var options = document.getElementsByName('meter-type');
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                type = options[i].value;
                break;
            }
        }
        return type;
    }

    function getLoadSelect() {
        var type = null;
        var options = document.getElementsByName('load-type');
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                type = options[i].value;
                break;
            }
        }
        return type;
    }

    var houseFlatPattern = /[0-9]*/;
    var houseNamePattern = /[a-zA-Z0-9\s]*/;
    var localityPattern = /[a-zA-Z0-9\s]*/;
    var cityPattern = /[a-zA-Z\s]*/;
    var districtPattern = /[a-zA-Z\s]*/;
    var statePattern = /[a-zA-Z\s]*/;

    var empty = false;

    // Validate each field against its pattern only if the checkbox is unchecked
    if (!useProfileAddress) {
        if (!houseFlatPattern.test(houseFlat) || houseFlat === "") {
            document.getElementById('house_no_warn').innerHTML = "Please enter house/flat/plot no. Use only numbers.";
            empty = true;
        }
        if (!houseNamePattern.test(houseName) || houseName === "") {
            document.getElementById('house_name_warn').innerHTML = "Please enter house/building name. Use only alphabets or numbers.";
            empty = true;
        }
        if (!localityPattern.test(locality) || locality === "") {
            document.getElementById('locality_warn').innerHTML = "Please enter name of locality. Use only alphabets.";
            empty = true;
        }
        if (!cityPattern.test(city) || city === "") {
            document.getElementById('city_warn').innerHTML = "Please enter name of city. Use only alphabets.";
            empty = true;
        }
        if (!districtPattern.test(district) || district === "") {
            document.getElementById('district_warn').innerHTML = "Please enter name of district. Use only alphabets.";
            empty = true;
        }
        if (!statePattern.test(state) || state === "") {
            document.getElementById('state_warn').innerHTML = "Please enter name of state. Use only alphabets.";
            empty = true;
        }
    }
    if (!(meterType == "Residential" || meterType == "Commercial")) {
        document.getElementById("meter_warn").innerHTML = "Please select a load type.";
        empty = true;
    }
    if (!(loadType == "Single phase" || loadType == "Three phase")) {
        document.getElementById("load_warn").innerHTML = "Please select a load type.";
        empty = true;
    }
    if (file === undefined) {
        document.getElementById("file_warn").innerHTML = "Please attach the proof of address.";
        empty = true;
    }

    if (empty) return;

    const connection_Id = parseInt(localStorage.getItem('connectionCount')) || 1001;
    const connect_id = connection_Id;
    localStorage.setItem('connectionCount', connection_Id + 1);

    var new_connection_appln = {
        connect_id: connect_id,
        fname: fname,
        lname: lname,
        email: email,
        number: number,
        houseFlat: houseFlat,
        houseName: houseName,
        locality: locality,
        city: city,
        district: district,
        state: state,
        loadType: loadType,
        meterType: meterType,
        applStatus: 'Pending',
        attachedFile: file.name
    }

    let connect_requests = JSON.parse(localStorage.getItem('requests')) || [];

    connect_requests.push(new_connection_appln);

    localStorage.setItem('requests', JSON.stringify(connect_requests));

    // If all validations pass
    // console.log("Your application is submitted successfully.");
    // Redirect to login page
    window.location.href = "homepage.html";
    return false; // Prevent form submission
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
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
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
    } else if (element.tagName === 'SMALL') {
        element.style.setProperty('color', 'red', 'important');
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
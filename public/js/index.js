// const validation = require('clientvalidation');

let signUpForm = document.getElementById('signup-form');
let createPortForm = document.getElementById('create-portfolio-form');
let changeSettingsForm = document.getElementById('change-settings-form');
let resetFirstPrompt = document.getElementById('reset-portfolio');
let resetSecondPrompt = document.getElementById('reset-reset-portfolio-id');
let chart = document.getElementById('myChart');

/* For Chart generation*/
// const labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//   ];

//   const data = {
//     labels: labels,
//     datasets: [{
//       label: 'My First dataset',
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgb(255, 99, 132)',
//       data: [0, 10, 5, 2, 20, 30, 45],
//     }]
//   };

//   const config = {
//     type: 'line',
//     data: data,
//     options: {}
//   };

//   const myChart = new Chart(
//     document.getElementById('myChart'),
//     config
//   );

function checkboxClicked(checkBox, className) {
    let checkBoxes = document.getElementsByClassName(className);

    Array.from(checkBoxes).forEach((item) => {
        if (checkBox.checked === false || (checkBox.checked === true && item !== checkBox)) {
            item.checked = false;
        }
    });
}

if (signUpForm) {
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorDiv = document.getElementById('signup-error');
        const fullName = document.getElementById('fullname');
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const checkBoxes = document.getElementsByClassName('portUpdates');
        const checkBoxClicked = Array.from(checkBoxes).filter((item) => item.checked === true);

        try {
            if (!fullName.value) throw `Fullname must be provided!`;
            checkIsProper(fullName.value, 'string', 'Full name');

        } catch (e) {
            errorDiv.innerHTML = e;
            errorDiv.hidden = false;
            fullName.value = '';
            fullName.focus();
            return;
            
        }

        try {
            if (!email.value) throw  `Email must be provided!`;
            checkIsProper(email.value, 'string', 'Email');
            checkEmail(email.value.trim().toLowerCase());

        } catch (e) {
            errorDiv.innerHTML = e;
            errorDiv.hidden = false;
            email.value = '';
            email.focus();
            return;
        }

        try {
            if (!username.value) throw `Username must be provided!`;
            checkIsProper(username.value, 'string', 'Username');
            checkString(username.value.trim(), 4, 'Username', true, false);
        } catch (e) {
            errorDiv.innerHTML = e;
            errorDiv.hidden = false;
            username.value = '';
            username.focus();
            return;
        }

        try {
            if (!password.value) throw `Password must be provided!`;
            checkIsProper(password.value, 'string', 'password');
            checkString(password.value.trim(), 6, 'password', false, false);
        } catch (e) {
            errorDiv.innerHTML = e;
            errorDiv.hidden = false;
            password.value = '';
            password.focus();
            return;
        }

        try {
            if (!checkBoxClicked[0]) throw `No checkbox clicked`;
            const portUpdateVal = checkBoxClicked[0].value.trim().toLowerCase();
            if (portUpdateVal !== 'none' && portUpdateVal !== 'hourly' && portUpdateVal !== 'daily' && portUpdateVal !== 'weekly' && portUpdateVal !== 'monthly') {
                throw `Not a valid email update option!`;
            }
        } catch (e) {
            errorDiv.innerHTML = e;
            errorDiv.hidden = false;
            checkBoxClicked[0].focus();
            return;
        }


        // if (fullName.value.trim().length == 0) {
        //     fullName.value = '';
        //     errorDiv.hidden = false;
        //     errorDiv.innerHTML = 'Invalid full name input!'
        //     fullName.focus();
        // }

        // if (email.value.trim().length === 0) {
        //     email.value = '';
        //     errorDiv.hidden = false;
        //     errorDiv.innerHTML = ''

        //     validation

        // }


        //Error checking here
        
        event.target.submit();
    });
}

if (createPortForm) {
    createPortForm.addEventListener('submit', (event) => {
        event.preventDefault();

        //Error checking here

        event.target.submit();
    });
}

if (changeSettingsForm) {
    changeSettingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        //Error checking here

        event.target.submit();
    });
}

if (resetFirstPrompt) {
    resetFirstPrompt.addEventListener('submit', (event) => {
        event.preventDefault();

        //Error checking here

        event.target.submit();
    });
}

if (resetSecondPrompt) {
    resetSecondPrompt.addEventListener('submit', (event) => {
        event.preventDefault();

        //Error checking here

        event.target.submit();
    });
}



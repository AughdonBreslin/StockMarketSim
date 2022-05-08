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



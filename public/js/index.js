let signUpForm = document.getElementById('signup-form');
let createPortForm = document.getElementById('create-portfolio-form');
let changeSettingsForm = document.getElementById('change-settings-form');
let resetFirstPrompt = document.getElementById('reset-portfolio');
let resetSecondPrompt = document.getElementById('reset-reset-portfolio-id');

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
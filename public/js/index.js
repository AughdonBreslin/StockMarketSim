let signUpForm = document.getElementById('signup-form');
let createPortForm = document.getElementById('create-portfolio-form');

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

        console.log("Hello");
        
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
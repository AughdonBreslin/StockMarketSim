let signUpForm = document.getElementById('signup-form');


function checkboxClicked(checkBox) {
    let checkBoxes = document.getElementsByClassName('emailUpdates');

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
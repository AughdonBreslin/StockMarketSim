function checkboxClicked(checkBox) {
    let checkBoxes = document.getElementsByClassName('emailUpdates');

    Array.from(checkBoxes).forEach((item) => {
        if (checkBox.checked === false || (checkBox.checked === true && item !== checkBox)) {
            item.checked = false;
        }
    });
}
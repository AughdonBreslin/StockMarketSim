(function ($) {
    
    /* LOGGING OUT */


    let logoutCheck = document.getElementById('logoutCheck');
    let continueButton = document.getElementById('continueButton');
    let cancelButton = document.getElementById('cancelButton');
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', event => {
        logoutCheck.style.display = "inline-flex";
        continueButton.style.display = "inline-flex";
        cancelButton.style.display = "inline-flex";
    });


    /* DEPOSIT / WITHDRAW */

    let portValue = $('#value'),
        form = $('#dwForm'),
        option = $('#dw'),
        quantity = $('#quantity');

    form.submit(function (event) {
        event.preventDefault();
        let portVal = parseInt(portValue.html());
        let quantVal = parseInt(quantity.val());
        if(quantVal <= 0) {
            alert("Quantity must be greater than zero.");
        } else {
            if(option.val() == "Deposit") {
                portVal += quantVal;
            } else if(quantVal > portVal) {
                alert("Insufficient funds to withdraw.");
            } else {
                portVal -= quantVal;
            }
            portValue.html(portVal);
        }
    });

    
    // alert("form is running")
    // form.submit(function (event) {
    //     alert("made it to form submit")
    //     event.preventDefault();
    //     try {
    //         checkIsProper(quantity.val(), 'string', 'Search term');
    //     } catch(e) {
    //         alert(e);
    //     }
    //     if(option.value == "Deposit"){
    //         portValue.val() += quantity.val();
    //     } else {
    //         // Withdraw
    //         if(quantity > portValue) {
    //             alert("Error: Quantity withdrawn is greater than portfolio value.")
    //         } else {
    //             portValue.val() -= quantity.val();
    //         }
    //     }
    //     alert(portValue.val());
    // })


  })(window.jQuery);
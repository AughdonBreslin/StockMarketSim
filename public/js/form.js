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

    $(document).on('click', '.stockLink', (event) => {
        event.preventDefault();

        console.log(event.target.href);
        let requestConfig = {
            method: 'GET',
            url: event.target.href
        };

        $.ajax(requestConfig).then(function (response) {

            let canvas = $("<canvas>");

            if (response) {
                let labels = Object.keys(response["Time Series (Daily)"]);
                response = Object.values(response["Time Series (Daily)"]);

                const newArray = response.map(entry => Number(entry['4. close']));
                console.log(newArray);

                let canvas = document.getElementById('myChart');
                let data = {
                    labels: labels,
                    datasets: [{
                        label: 'Stock History',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: newArray,
                    }]
                };
                
                const config = {
                    type: 'line',
                    data: data,
                    options: {}
                };

                const myChart = new Chart(
                    canvas,
                    config
                  );
            }
        })
    });

    /* DEPOSIT / WITHDRAW */
    let portBalance = $('#balance'),
        form = $('#dwForm'),
        option = $('#dw'),
        quantity = $('#quantity');

    form.submit(function (event) {
        event.preventDefault();
        let portBal = parseInt(portBalance.html());
        let quantVal = parseInt(quantity.val());
        let optionVal = option.val();
        if(quantVal <= 0) {
            alert("Quantity must be greater than zero.");
        } else {
            if(option.val() == "Deposit") {
                portBal += quantVal;
            } else if(quantVal > portBal) {
                alert("Insufficient funds to withdraw.");
            } else {
                portBal -= quantVal;
            }
            portBalance.html(portBal);
            var requestConfig = {
                method: 'POST',
                url: '/database',
                contentType: 'application/json',
                data: JSON.stringify({
                    option: optionVal,
                    portBal: portBal,
                    quantVal: quantVal
                })
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                console.log(responseMessage);
            });
        }
    });

  })(window.jQuery);
$(function () {
    // console.log("This is my test statement!"); /* fires immediately after page loads */

    // If user wants to make an automated trade, ask for threshold. And if 'buying' ask for priority level.
    $('#automated').on('change', function () {

        $('#threshold').show();
        $('#threshold').prop("disabled", false);
        $('#threshold').prop("required", true);
        $('#threshold_lbl').show();


        if ($('#buy').is(':checked')) {
            $('#priority').show();
            $('#priority').prop("disabled", false);
            $('#priority').prop("required", true);
            $('#priority_lbl').show();
        }

    });

    // If user wants to make an manual trade, hide and disable threshold and priority level.
    $('#manual').on('change', function () {
        $('#threshold').hide();
        $('#threshold').prop("disabled", true);
        $('#threshold').prop("required", false);
        $('#threshold_lbl').hide();

        $('#priority').hide();
        $('#priority').prop("disabled", true);
        $('#priority').prop("required", false);
        $('#priority_lbl').hide();
    });

    // If user wants to buy and automated is checked, show priority and show threshold.
    $('#buy').on('change', function () {
        // If user wants to make an manual trade, hide and disable threshold and priority level.
        if ($('#automated').is(':checked')) {
            $('#threshold').show();
            $('#threshold').prop("disabled", false);
            $('#threshold').prop("required", true);
            $('#threshold_lbl').show();

            $('#priority').show();
            $('#priority').prop("disabled", false);
            $('#priority').prop("required", true);
            $('#priority_lbl').show();
        }

    });

    // If user wants to sell, show threshold if automated.
    $('#sell').on('change', function () {
        // If user wants to make an manual trade, hide and disable threshold and priority level.

        $('#priority').hide();
        $('#priority').prop("disabled", true);
        $('#priority').prop("required", false);
        $('#priority_lbl').hide();

        if ($('#automated').is(':checked')) {
            $('#threshold').show();
            $('#threshold').prop("disabled", false);
            $('#threshold').prop("required", true);
            $('#threshold_lbl').show();
        } else {
            $('#threshold').hide();
            $('#threshold').prop("disabled", true);
            $('#threshold').prop("required", false);
            $('#threshold_lbl').hide();
        }

    });

    $('#tradeForm').on('submit', function (e) {
        e.preventDefault();

        // Check all the inputs here:

        const ticker = $('#ticker_input').val().trim();
        console.log("ticker=" + ticker);
        if (typeof ticker !== 'string' || ticker.length < 1) {
            alert('Enter a valid stock ticker!');
            return;
        }
        // Check if this is a valid stock ticker


        const quantity = parseInt($('#quantity').val());
        console.log("quantity=" + quantity);
        if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 1) {
            alert('Quantity must provide be a positive number!');
            return;
        }

        const trans_opt = $("input[name='trans-option']:checked").val().trim();
        console.log("trans_opt=" + trans_opt);  /* is either 'buy' or 'sell' */
        if (typeof trans_opt !== 'string' || trans_opt.length < 1) {
            alert('Transaction option must be either buy or sell!');
            return;
        }

        const trans_mode = $("input[name='trans-mode']:checked").val().trim();
        console.log("trans_mode=" + trans_mode);  /* is either 'automated' or 'manual' */
        if (typeof trans_mode !== 'string' || trans_mode.length < 1) {
            alert('Transaction mode must be either automated or manual!');
            return;
        }

        let threshold;
        let priority;

        if (trans_mode == 'manual') {
            threshold = -1;
            priority = -1;
        } else { /* automatic - check transaction option */

            threshold = parseInt($('#threshold').val().trim());
            console.log("threshold=" + threshold);
            if (typeof threshold !== 'number' || isNaN(threshold) || threshold < 1) {
                alert('Threshold must provide be a positive number!');
                return;
            }

            if (trans_opt == 'sell') {
                priority = -1;
            } else {
                priority = parseInt($('#priority').val().trim());
                console.log("priority=" + priority);
                if (typeof priority !== 'number' || isNaN(priority) || priority < 1) {
                    alert('Priority must provide be a positive number!');
                    return;
                }
            }
        }

        console.log("Finished validating input!");

        // Send the ajax request:
        var requestConfig = {
            method: 'POST',
            url: '/trade',
            contentType: 'application/json',
            body: JSON.stringify({
                ticker: ticker,
                quantity: quantity,
                trans_opt: trans_opt,
                trans_mode: trans_mode,
                threshold: threshold,
                priority: priority
            })
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            console.log("response received!");
            console.log(responseMessage);
        });


        // Send the request to the server



    });


});

$(function () {
    console.log("This is my test statement!"); /* fires immediately after page loads */

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




        console.log("form button clicked!");
    });


});

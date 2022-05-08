
(function ($) {

    $(window).on("load", (function (event) {
        // console.log("window load");

        /* Add the event listeners to hide/disable certain parts of the form */

    }));


    /* Form submission */
    $('#searchForm').on("submit", function (event) {
        // console.log("form submit");

        event.preventDefault();

        let user_input = $('#search_term').val().trim();    /* Trim input */

        // console.log("Search term: " + user_input + '.');

        if (user_input) { /* valid input */
            $('#showList').empty();    /* Empty the showList elem */
            $('#showList').show();     /* Disply showList */

            /* Make a AJAX request */
            const requestConfig = {
                url: `http://api.tvmaze.com/search/shows?q=${user_input}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'GET'
            };

            $.ajax(requestConfig).then(function (shows_list) {
                // console.log("printing from ajax request form submission");
                // console.log(JSON.stringify(shows_list));
                // console.log("# search results = " + shows_list.length);

                if (shows_list.length == 0) {
                    alert("No search results found!");
                } else {
                    shows_list.forEach(show => {
                        let a = `<a class="showLink" href=${show.show._links.self.href}> ${show.show.name} </a>`;

                        /* Create the <li> elem and append it to showList*/
                        $('#showList').append(`<li class="showLiElem"> ${a} </li>`);
                        $('.showLiElem').show(); /* Might be unneccessary */
                    });
                    bindShowLink($("#showList"));
                    $("#showList").show();
                    // console.log("# of List items in showList: " + $('#showList').children().length);
                }
            });
        } else {    /* invalid input */
            alert("Enter a valid search term!");
        }
        $('#show').hide();                  /* hide 'show' elem (redundant) */
        $('#homeLink').show();              /* show homeLink */
        $('#searchForm').trigger('reset');
        $('#search_term').focus();
        $('#search_term').value = '';

    });


})(window.jQuery);

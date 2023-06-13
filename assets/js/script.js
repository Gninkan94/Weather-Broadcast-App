// this will load all the page.

$(document).ready(function () {
    //this is the search button feature
    $("#search-button").on("click", function () {
        //this will get the value of the user input search-value.
        var searchTerm = $("#search-value").val();
        // this will empty the user input field.
        $("#search-value").val("");
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });

    //here is the search button enter key event. 
    $("#search-button").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            weatherFunction(searchTerm);
            weatherForecast(searchTerm);
        }
    });

    //this will pull the previous searches from local storage
    var history = JSON.parse(localStorage.getItem("history")) || [];

    //this will set the history array search to correct the length
    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    //thi will makes a row for each element in history array for the (searchTerms)
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }

    //This will put the searched cities underneath the previous searched city 
    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }

    //Lets create a listener for list item on click function
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });

    function weatherFunction(searchTerm) {
        // lets use fetch to ask and retrieve data
        var url = "https://api.openweathermap.org/data/2.5/forecast?lat=37.090240&lon=-95.712891&appid=19316f025ae496e0de9bcd1c980a1f51";

        fetch(url).then(function (data) {
            //if the  index of search value does not exist
            if (history.indexOf(searchTerm) === -1) {
                // this will push searchValue to history array
                history.push(searchTerm);
                //this will places item pushed into local storage
                localStorage.setItem("history", JSON.stringify(history));
                createRow(searchTerm);
            }
            // this will clears out old content.
            $("#today").empty();

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }
    // this is the  function of weatherForecast(searchTerm) 
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=19316f025ae496e0de9bcd1c980a1f51&units=imperial",
        })
            .then(function (data) {
                console.log(data);
                $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

                //lests loop to create a new card for 5 days pull data.
                for (var i = 0; i < data.list.length; i++) {

                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                        var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        var colFive = $("<div>").addClass("row-md-4");
                        var cardFive = $("<div>").addClass("card bg-primary text-white");
                        var cardBodyFive = $("<div>").addClass("card-body p-8");
                        var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                        var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                        //this will merge all together and put on page
                        colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                        //append card to column, body to card, and other elements to body
                        $("#forecast .row").append(colFive);
                    }
                }
            });
    }

});

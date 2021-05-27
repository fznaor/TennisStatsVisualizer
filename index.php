<!DOCTYPE html>
<meta charset="utf-8">
<link href='https://fonts.googleapis.com/css?family=Monda' rel='stylesheet'>
<link rel="stylesheet" href="styles/index.css"></link>

<body>
    <header id="mainHeader">
        <h1>Tennis stats visualizer</h1>
    </header>

    <div id="introText">
        <p>Welcome! This website enables you to select a tennis player and see a visualization of his various stats.</p>
        <p>In order to keep loading times as short as possible, the data is limited to ATP level results (including Grand Slams, ATP Challengers and Davis Cup) from 2010 onwards.</p>
        <p>All data was taken from <a href="https://github.com/JeffSackmann/tennis_atp">https://github.com/JeffSackmann/tennis_atp</a>, country flags taken from <a href="https://www.countryflags.io/">https://www.countryflags.io/</a>.</p>
    </div>  

    <div id="search">
        <input type="text" placeholder="Enter a tennis player">
    </div>

    <script src="//d3js.org/d3.v3.min.js"></script>
    <script src="scripts/countryParser.js"></script>

    <script>
        var foundPlayers = d3.select("body").append("div").attr("class", "foundPlayers");
        var notFoundMsg = d3.select("body").append("div")
            .attr("class", "emptyMsg")
            .text("No players found.")
            .style("display", "none");

        var input = d3.select("input")
            .on("keyup", displayResults);

        function displayResults() {
            event.preventDefault();
            d3.csv("data/atp_players.csv", function (error, players) {
                var foundCount = 0;
                var data = [];

                if (!document.querySelector("input").value.trim().length < 1) {
                    for (var player of players) {
                        if ((player.name + " " + player.surname).toUpperCase().includes(document.querySelector("input").value.toUpperCase())) {
                            data.push(player);
                            foundCount++;
                        }
                    }
                    if (foundCount == 0) {
                        notFoundMsg.style("display", null);
                    }
                    else {
                        notFoundMsg.style("display", "none");
                    }
                }

                var playerData = foundPlayers
                    .selectAll("div")
                    .data(data, function (d) { return d.id; });

                playerData.exit().remove();

                var playerInfo = playerData.enter()
                    .append("div")
                    .attr("class", "playerInfo");

                playerData.order();

                playerInfo.append("img")
                    .attr("class", "flag")
                    .attr("src", function (d) { return "https://www.countryflags.io/" + getTwoLetterCountryCode(d.country) + "/flat/64.png"; });

                playerInfo.append("a")
                    .text(function (d) { return d.name + " " + d.surname; })
                    .attr("class", "name")
                    .attr("href", function (d) { return "player.php?id=" + d.id; });
            });
        }
    </script>
</body>
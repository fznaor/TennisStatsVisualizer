<!DOCTYPE html>
<meta charset="utf-8">
<link href='https://fonts.googleapis.com/css?family=Monda' rel='stylesheet'>
<link rel="stylesheet" href="styles/playerHeader.css">
<link rel="stylesheet" href="styles/loadScreen.css">
<link rel="stylesheet" href="styles/quickFacts.css">
<link rel="stylesheet" href="styles/rankChart.css">
<link rel="stylesheet" href="styles/courtStats.css">
<link rel="stylesheet" href="styles/activityChart.css">
<link rel="stylesheet" href="styles/map.css">

<style>
    body {
        margin: 0;
        position: relative;
        font-family: "Monda";
        background-color: black;
        color: white;
    }

    a{
        text-decoration: none;
        color: white;
    }

    footer{
        margin: 50px 0;
        display: flex;
        justify-content: center;
    }

    footer a{
        font-size: 25px;
    }
</style>

<body>
    <script src="//d3js.org/d3.v3.min.js"></script>
    <script src="https://d3js.org/topojson.v1.min.js"></script>
    <script src="scripts/countryParser.js"></script>

    <script type="module">
        import {drawRankChart} from "./scripts/rankChart.js";
        import {drawQuickFactsSection} from "./scripts/quickFacts.js";
        import {drawCourtStats} from "./scripts/courtStats.js";
        import {drawPlayerHeader} from "./scripts/playerHeader.js";
        import {calculateStats} from "./scripts/statsCalculator.js";
        import {drawActivityChart} from "./scripts/activityChart.js";
        import {drawMap} from "./scripts/map.js";

        d3.csv("data/atp_players.csv", function(error, players){
            var player = players.filter(x => x.id == document.location.href.split('id=')[1])[0];
            document.title = player.name + " " + player.surname + " - Tennis stats visualizer";
            drawPlayerHeader(player);

            d3.csv("data/atp_matches.csv", function(error, matches){
                if(error) throw error;

                d3.csv("data/atp_rankings.csv", function (error, rankings) {
                    if (error) throw error;
                    
                    var playerRankings = rankings.filter(x => x.player == player.id);
                    var playerMatches = matches.filter(x => x.winner_id == player.id || x.loser_id == player.id);

                    var stats = calculateStats(player, playerMatches);

                    d3.select(".load").style("display", "none");
                    d3.select(".mainDiv").style("height", "auto");

                    drawQuickFactsSection(playerRankings, stats);

                    var otherStats = d3.select("body").append("div").attr("class", "statsDiv")
                        .style("opacity", "0");

                    setTimeout(() => {  drawRankChart(playerRankings);
                        drawCourtStats(stats);
                        drawActivityChart(player, playerMatches);
                        drawMap(player, stats.countryStats);

                        otherStats.transition()
                            .duration(2000)
                            .style("opacity", "1");

                        var footer = d3.select("body").append("footer");

                        footer.append("a")
                            .attr("href", "index.php")
                            .attr("class", "footer")
                            .style("text-align", "center")
                            .text("Select another player");

                    }, 1000);
                });
            });
        });
    </script>
</body>
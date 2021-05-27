export function drawQuickFactsSection(playerRankings, stats){
    var wonMatches = stats.wonMatches, lostMatches = stats.lostMatches, titles = stats.titles, bestWin = stats.bestWin;

    var quickFactsSection = d3.select("body")
        .append("section")
        .attr("class", "quickFacts");
    
    var winLossData = [{"category": "wins", "value": wonMatches}, {"category": "losses", "value": lostMatches}];
    
    var height = 250, width = 250;

    var pieChart = quickFactsSection
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

    var radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["chartreuse", "red"]);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 20);

    var pie = d3.layout.pie()
        .sort(null)
        .startAngle(0)
        .endAngle(2*Math.PI)
        .value(function(d) { return d.value; });

    var g = pieChart.selectAll(".arc")
        .data(pie(winLossData))
        .enter().append("g")
        .attr("class", "arc");

    //https://stackoverflow.com/questions/20501067/animating-d3-donut-chart-on-load
    g.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .transition().delay(function(d, i) { return i * 500; }).duration(500)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    var pieChartText = g.append("text")
        .attr("y", "-40");
    
    pieChartText.append("tspan")
        .attr("class", "pieText")
        .style("fill", "chartreuse")
        .text(wonMatches + " wins")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");
        
    pieChartText.append("tspan")
        .attr("class", "pieText")
        .style("fill", "red")
        .text(lostMatches + " losses")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    var titlesSection = quickFactsSection.append("div")
        .attr("class", "titlesSection")
        .style("opacity", "0");

    titlesSection.transition()
        .duration(1000)
        .style("opacity", "1");

    var titlesSvg = titlesSection.append("svg")
        .attr("width", "250")
        .attr("height", "250");

    titlesSvg.append("svg:image")
        .attr("xlink:href", "images/trophy.png")
        .attr("width", "250");
    
    titlesSection.append("p")
        .text(titles)
        .style("font-size", "35px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-top", "-200px");

    titlesSection.append("p")
        .text("Titles")
        .style("font-size", "25px")
        .style("text-align", "center")
        .style("margin-top", "100px");

    var peakRanking = d3.min(playerRankings, function (d) { return parseInt(d.rank); })
    
    var peakRankSection = quickFactsSection.append("div")
        .attr("class", "titlesSection")
        .style("opacity", "0");

    peakRankSection.transition()
        .duration(1000)
        .style("opacity", "1");

    var peakRankSvg = peakRankSection.append("svg")
        .attr("width", "180")
        .attr("height", "250");

    peakRankSvg.append("svg:image")
        .attr("y", "50px")
        .attr("xlink:href", "images/arrow.png")
        .attr("width", "180");

    var peakRankText = (peakRanking == undefined) ? "None" : ("#" + String(peakRanking));
    
    peakRankSection.append("p")
        .text(peakRankText)
        .style("font-size", "35px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-top", "-90px");

    peakRankSection.append("p")
        .text("Peak ranking")
        .style("font-size", "25px")
        .style("text-align", "center")
        .style("margin-top", "-22px")
        .style("margin-bottom", "48px");

    var bestWinSection;

    if(bestWin != undefined){
        bestWinSection = quickFactsSection.append("div")
            .html(`<p id="bestWinTitle">Best win</p>
                    <p id="bestWinName">def.<img src="https://www.countryflags.io/${getTwoLetterCountryCode(bestWin.loser_ioc)}/flat/32.png">
                        <a href="player.php?id=${bestWin.loser_id}">${bestWin.loser_name}</a>\u00A0(#${bestWin.loser_rank})</p>
                    <p>${bestWin.tourney_date.substring(0,4)} ${bestWin.tourney_name}</p>
                    <p>${bestWin.score}</p>`)
            .attr("class", "bestMatch")
            .style("opacity", "0");
    }
    else{
        bestWinSection = quickFactsSection.append("div")
            .html(`<p id="bestWinTitle">Best win</p>
                    <p>None</p>`)
            .attr("class", "bestMatch")
            .style("opacity", "0");
    }

    bestWinSection.transition()
        .duration(1000)
        .style("opacity", "1");
}
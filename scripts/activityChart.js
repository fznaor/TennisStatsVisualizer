export function drawActivityChart(player, playerMatches) {
    var chartSection = d3.select(".statsDiv").append("section")
        .attr("class", "activityChart");

    chartSection.append("h2")
        .text("Player activity");

    var parseDate = d3.time.format("%Y%m%d").parse;

    playerMatches.forEach(function (d) {
        d.tourney_date = parseDate(d.tourney_date);
        d["tourney_year"] = d3.time.format("%Y")(d.tourney_date);
        d["tourney_date"] = d3.time.format("%d.%m.")(d.tourney_date);
        d["tourney_date"] = d3.time.format("%d.%m.").parse(d["tourney_date"]);
    });

    var yearRange = [d3.min(playerMatches, function (d) { return parseInt(d.tourney_year) }), d3.max(playerMatches, function (d) { return parseInt(d.tourney_year) })];

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
    };

    var results = groupBy(playerMatches, "tourney_id");
    var results = Object.values(results)

    var margin = { top: 0, right: 40, bottom: 30, left: 55 },
        width = window.innerWidth - margin.left - margin.right - 20,
        height = 50 + 60 * (yearRange[1] - yearRange[0] + 1) - margin.top - margin.bottom;

    var activityChart = chartSection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.time.scale()
        .domain([new Date(1900, 0, 1), new Date(1900, 11, 31)])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([yearRange[1] + 1, yearRange[0] - 1])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%B"));

    activityChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yearSpan = [];
    for (var i = yearRange[0]; i <= yearRange[1]; i++)
        yearSpan.push(i);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues(yearSpan)
        .outerTickSize(0)
        .tickFormat(d3.format("d"));

    activityChart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var g = activityChart.append("g");

    function getCircleColor(level) {
        switch (level) {
            case 'M': return "gold";
            case 'G': return "red";
            case 'C': return "#00ff00";
            case 'A': return "#002865";
            case 'D': return "#009933";
            case 'F': return "silver";
        }
    }

    function getTextColor(level) {
        switch (level) {
            case 'M': return "navy";
            case 'G': return "white";
            case 'C': return "navy";
            case 'A': return "white";
            case 'D': return "white";
            case 'F': return "navy";
        }
    }

    var tooltip = d3.select(".statsDiv").append("div")
        .attr("class", "tooltipAct")
        .style("display", "none");

    g.selectAll("circle")
        .data(results)
        .enter()
        .append("circle")
        .attr("class", function(d){ return d[0].tourney_level;})
        .attr("cx", function (d) { return x(d[0].tourney_date); })
        .attr("cy", function (d) { return y(d[0].tourney_year); })
        .attr("r", 11)
        .style("fill", function (d) { return getCircleColor(d[0].tourney_level); })
        .on("mouseover", function () { tooltip.style("display", null); })
        .on("mouseout", function () { tooltip.style("display", "none"); })
        .on("mousemove", function (d) { mousemove(d) });

    function mousemove(d) {
        tooltip.html(getTournamentResults(d));
        var tooltipWidth = d3.select('.tooltipAct').node().getBoundingClientRect().width;
        var xOffset = (d3.event.pageX < 0.8 * width) ? 50 : -tooltipWidth - 50;
        tooltip.attr("style", "left:" + (d3.event.pageX + xOffset) + "px;top:" + d3.event.pageY + "px;");
    }

    function getTournamentResults(data) {
        var html = "";
        html += `<p class="tournName">${data[0].tourney_year} ${data[0].tourney_name}</p>`;
        for (var match of data) {
            if (match.winner_id == player.id)
                html += `<p class="matchResult"><span class="roundText">${match.round}:</span>\u00A0 def. \u00A0<img style="width:25px;height:25px;" class="miniflag" src="https://www.countryflags.io/${getTwoLetterCountryCode(match.loser_ioc)}/flat/64.png">
                \u00A0${match.loser_name} (#${match.loser_rank}) ${match.score}</p>`;
            else html += `<p class="matchResult"><span class="roundText">${match.round}:</span>\u00A0 l.t. \u00A0<img style="width:25px;height:25px;" class="miniflag" src="https://www.countryflags.io/${getTwoLetterCountryCode(match.winner_ioc)}/flat/64.png">
            \u00A0${match.winner_name} (#${match.winner_rank}) ${match.score}</p>`;
        }
        return html;
    }

    function getFontSize(round) {
        if (round == "R128")
            return "8px";
        else return "10px";
    }

    function getOffset(round) {
        if (round == "R128")
            return 3;
        else return 4;
    }

    g.selectAll("text")
        .data(results)
        .enter()
        .append("text")
        .text(function (d) {
            if (d[d.length - 1].round != 'F')
                return d[d.length - 1].round;
            return (d[d.length - 1].winner_id == player.id) ? 'W' : 'F';
        })
        .attr("class", function(d){ return d[0].tourney_level;})
        .attr("x", function (d) { return x(d[0].tourney_date); })
        .attr("y", function (d) { return y(d[0].tourney_year) + getOffset(d[d.length - 1].round); })
        .style("fill", function (d) { return getTextColor(d[0].tourney_level); })
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .style("font-size", function (d) { return getFontSize(d[d.length - 1].round); })
        .style("pointer-events", "none");

    var levels = ["Grand Slam", "ATP Masters 1000", "ATP Tour", "ATP Challenger", "Davis Cup", "ATP Finals"];
    var colors = ["red", "gold", "#002865", "#00ff00", "#009933", "silver"];
    var ids = ['G', 'M', 'A', 'C', 'D', 'F'];

    var legend = chartSection.append("div")
        .attr("class", "chartLegend")
        .selectAll("svg")
        .data(colors)
        .enter()
        .append("div")
        .attr("class", "legendItem");

    legend.append("input")
        .attr("type", "checkbox")
        .attr("checked", "true")
        .attr("id",function (d, i) { return ids[i]; })
        .on("click", function(){
            if(d3.event.target.checked){
                d3.selectAll(`circle.${d3.event.target.id}`)
                    .transition()
                    .duration(500)
                    .style("opacity", "1");

                d3.selectAll(`text.${d3.event.target.id}`)
                    .transition()
                    .duration(500)
                    .style("opacity", "1");
            }
            else{
                d3.selectAll(`circle.${d3.event.target.id}`)
                    .transition()
                    .duration(500)
                    .style("opacity", "0");
                    
                d3.selectAll(`text.${d3.event.target.id}`)
                    .transition()
                    .duration(500)
                    .style("opacity", "0");
            }
        });

    legend.insert("svg")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class", "legendCircle")
        .append("circle")
        .attr("cx", 7.5)
        .attr("cy", 7.5)
        .attr("r", 7.5)
        .style("fill", function (d) { return d; });

    legend.insert("p")
        .text(function (d, i) { return levels[i]; })
}
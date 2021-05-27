export function drawMap(player, countryStats){
    var mapSection = d3.select(".statsDiv")
        .append("div")
        .attr("class","mapSection");

    mapSection.append("h2")
        .text("Country head-to-head");

    var margin = {left: 20, right: 2}
    var width = window.innerWidth - 20 - margin.left - margin.right;
    var height = (window.innerWidth - 20 - margin.left - margin.right) * (1080/1920);

    var projection = d3.geo.mercator()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2 + 170 * (width/1920)]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = mapSection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    var tooltip = d3.select(".statsDiv").append("div")
        .attr("class", "tooltipCountry")
        .style("display", "none");

    d3.json("data/countries.json", function(error, world) {
        var data = topojson.feature(world, world.objects.countries);

        svg.selectAll("path.country")
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("id", function(d) { return d.id; })
            .attr("d", path) .style("fill", function(d){return getColor(d.properties.name);})
            .style("stroke", "black")
            .style("stroke-width", 0.1)
            .style("stroke-opacity", 1)
            .on("mouseover", function (d) { 
                if(getCountryCodeFromName(d.properties.name) in countryStats)
                    tooltip.style("display", null); 
                else tooltip.style("display", "none");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); })
            .on("mousemove", function (d) { mousemove(d.properties.name) });
    });

    function getColor(countryName){
        var countryCode = getCountryCodeFromName(countryName);
        if(countryCode == undefined) return "gray";
        if(!(countryCode in countryStats)) return "gray";
        if(countryStats[countryCode].wins == countryStats[countryCode].losses) return "#EFEFEF";
        if(countryStats[countryCode].wins > countryStats[countryCode].losses) return "#006400";
        return "#8b0000";
    }

    function mousemove(countryName){
        if(getCountryCodeFromName(countryName) in countryStats){
            tooltip.html(getCountryResults(countryName));
            var tooltipWidth = d3.select('.tooltipCountry').node().getBoundingClientRect().width;
            var xOffset = (d3.event.pageX + tooltipWidth < width - 25) ? 50 : -tooltipWidth - 50;
            tooltip.attr("style", "left:" + (d3.event.pageX + xOffset) + "px;top:" + d3.event.pageY + "px;");
        }
    }

    function getCountryResults(countryName) {
        var html = "";
        var countryCode = getTwoLetterCountryCode(getCountryCodeFromName(countryName));
        html += `<div class="countryHeader"><img class="miniflag" style="width:30px;height:30px;" src="https://www.countryflags.io/${countryCode}/flat/64.png">\u00A0<p class="countryName">${countryName}</p></div>`;
        html += `<div class="generalH2H">
                    <p style="font-weight:bold">${countryStats[getCountryCodeFromName(countryName)].wins} wins / ${countryStats[getCountryCodeFromName(countryName)].losses} losses</p>
                </div>`
        html += `<div class="countryPlayerH2H">`

        var players = countryStats[getCountryCodeFromName(countryName)].players;
        var keysSorted = Object.keys(players).sort(function(a,b){return (players[b].wins - players[b].losses) - (players[a].wins - players[a].losses)});
        
        for(var player of keysSorted){
            var color;
            if(players[player].wins > players[player].losses)color = "green";
            else if (players[player].wins < players[player].losses)color = "red";
            else color = "gray";
            html += `<p style="color:${color}">${players[player].wins} - ${players[player].losses} vs. ${player}</p>`;
        }

        html += `</div>`;
        return html;
    }

    var levels = ["Positive H2H", "Negative H2H", "Neutral H2H", "No matches played"];
    var colors = ["#006400", "#8b0000", "#EFEFEF", "gray"];

    var legend = mapSection.append("div")
        .attr("class", "chartLegend")
        .selectAll("svg")
        .data(colors)
        .enter()
        .append("div")
        .attr("class", "legendItem");

    legend.append("svg")
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

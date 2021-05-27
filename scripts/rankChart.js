export function drawRankChart(playerRankings) {
    if (playerRankings.length == 0) {
        var chartSection = d3.select(".statsDiv").append("section")
            .attr("class", "rankChart");

        chartSection.append("h2")
            .text("Ranking history");

        chartSection.append("p")
            .style("text-align", "center")
            .text("This player hasn't achieved an ATP ranking");
        return;
    }

    var parseDate = d3.time.format("%Y%m%d").parse,
        bisectDate = d3.bisector(function (d) { return d.ranking_date; }).left,
        formatValue = d3.format(","),
        dateFormatter = d3.time.format("%d.%m.%Y.");

    playerRankings.forEach(function (d) {
        d.ranking_date = parseDate(d.ranking_date);
    });

    var rankDataset = playerRankings.map(({ ranking_date, rank }) => ({ ranking_date, rank }));
    var pointsDataset = playerRankings.map(({ ranking_date, points }) => ({ ranking_date, points }));
    var currentData = rankDataset;

    for (let i = 0; i < playerRankings.length; i++) {
        rankDataset[i]["y"] = rankDataset[i]["rank"];
        pointsDataset[i]["y"] = pointsDataset[i]["points"];
        delete rankDataset[i]["rank"];
        delete pointsDataset[i]["points"];
    }

    var margin = { top: 30, right: 40, bottom: 30, left: 50 },
        width = window.innerWidth - margin.left - margin.right - 20,
        height = 500 - margin.top - margin.bottom;

    var chartSection = d3.select(".statsDiv").append("section")
        .attr("class", "rankChart");

    chartSection.append("h2")
        .text("Ranking history");

    var rankChart = chartSection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var isYLinear = true;

    function getTickCount(){
        var minYear = currentData[0].ranking_date.getFullYear();
        var maxYear = currentData[currentData.length - 1].ranking_date.getFullYear();

        if((maxYear - minYear + 1) < (width / 140)){
            return maxYear - minYear + 1;
        }
        else return width/140;
    }

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(getTickCount())
        .tickFormat(d3.time.format("%Y"));

    rankChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("s"));

    var yg = rankChart.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("fill", "white")
        .style("text-anchor", "end");

    var yAxisName = yg.text("Rank")
        .attr("fill", "white");

    var line = d3.svg.line()
        .x(function (d) { return x(d.ranking_date); })
        .y(function (d) { return y(d.y); });

    rankChart.append("path")
        .datum(currentData)
        .attr("class", "line")
        .attr("d", line);

    var tooltip = d3.select(".statsDiv").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    var focus = rankChart.append("svg:image")
        .attr("class", "focus")
        .attr("xlink:href", "images/ball.png")
        .style("display", "none");

    tooltip.append("div")
        .attr("class", "tooltip-date");

    var tooltipRank = tooltip.append("div");
    tooltipRank.append("span")
        .attr("class", "tooltip-title")
        .text("Rank: ");

    tooltipRank.append("span")
        .attr("class", "tooltip-rank");

    var tooltipPoints = tooltip.append("div");
    tooltipPoints.append("span")
        .attr("class", "tooltip-title")
        .text("Points: ");

    tooltipPoints.append("span")
        .attr("class", "tooltip-points");

    rankChart.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () { focus.style("display", null); tooltip.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); tooltip.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(currentData, x0, 1),
            d0 = playerRankings[i - 1],
            d1 = playerRankings[i],
            d = x0 - d0.ranking_date > d1.ranking_date - x0 ? d1 : d0;
            
        var quickFactsHeight = d3.select('.quickFacts').node().getBoundingClientRect().height;
        focus.attr("transform", "translate(" + (x(d.ranking_date) - 10) + "," + (y(currentData[d == d0 ? i - 1 : i].y) - 10) + ")");

        var xOffset = (x(d.ranking_date) + 64) > window.innerWidth - 150 ? (x(d.ranking_date) - 80) : (x(d.ranking_date) + 64);
        
        tooltip.attr("style", "left:" + xOffset + "px;top:" + (y(currentData[d == d0 ? i - 1 : i].y) + quickFactsHeight+250) + "px;");
        tooltip.select(".tooltip-date").text(dateFormatter(d.ranking_date));
        tooltip.select(".tooltip-rank").text(formatValue(d.rank));
        tooltip.select(".tooltip-points").text(formatValue(d.points));
    }

    function update(data, firstUpdate = false) {
        x.domain([data[0].ranking_date, data[data.length - 1].ranking_date]);

        rankChart.selectAll(".x.axis").transition()
            .duration(1000)
            .call(xAxis);

        if (data == rankDataset) {
            y.domain([d3.max(data, function (d) { return parseInt(d.y) }), d3.min(data, function (d) { return parseInt(d.y) })]);
        }
        else if (!isYLinear) {
            y.domain([d3.min(data, function (d) { return parseInt(d.y) }), d3.max(data, function (d) { return parseInt(d.y) })]);
        }
        else {
            y.domain([0, d3.max(data, function (d) { return parseInt(d.y) })]);
        }
        rankChart.selectAll(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);

        yAxisName.text(data == rankDataset ? "Rank" : "Points").attr("fill", "white");

        rankChart.select(".line")
            .transition()
            .duration(firstUpdate ? 0 : 1000)
            .attr("d", line(data));

        var rankBtn = d3.select("#rankBtn")
        var pointsBtn = d3.select("#pointsBtn");

        if (data == pointsDataset) {
            rankBtn.attr("disabled", null);
            pointsBtn.attr("disabled", "true");
        }
        else {
            rankBtn.attr("disabled", "true");
            pointsBtn.attr("disabled", null);
        }
    }
    update(rankDataset, true);

    function changeScale() {
        if (!isYLinear) {
            y = d3.scale.linear()
                .range([height, 0]);
            isYLinear = true;
        }
        else {
            y = d3.scale.log()
                .range([height, 0]);
            isYLinear = false;
        }

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format("s"));

        update(currentData);
    }

    var buttons = chartSection.append("div")
        .attr("class", "rankChartButtons");

    buttons.append("button")
        .attr("id", "rankBtn")
        .attr("disabled", "true")
        .text("Rank")
        .on("click", function () {
            update(rankDataset);
            currentData = rankDataset;
        });

    buttons.append("button")
        .attr("id", "pointsBtn")
        .text("Points")
        .on("click", function () {
            update(pointsDataset);
            currentData = pointsDataset;
        });


    buttons.append("button")
        .attr("id", "scaleBtn")
        .text("Toggle y-axis scale")
        .on("click", function () {
            changeScale();
        });
}
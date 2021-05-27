export function drawCourtStats(stats){
    var margin = { right: 20, left: 20 }
    var width = window.innerWidth - margin.left - margin.right - 20;
    var height = 600;

    var courtSvg = d3.select(".statsDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .attr("class", "court");

    var court = courtSvg.append("g")
        .attr("transform", "translate(" + margin.left + ", 0)");

    court.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", 20)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", width-20)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", 20)
        .attr("fill", "white");
    
    court.append("rect")
        .attr("x", 20)
        .attr("y", "0")
        .attr("height", 20)
        .attr("width", width - 40)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 20)
        .attr("y", height - 20)
        .attr("height", 20)
        .attr("width", width - 40)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", width / 2 - 10)
        .attr("y", 20)
        .attr("height", height - 40)
        .attr("width", 20)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 0.125 * height - 10)
        .attr("height", 20)
        .attr("width", width - 40)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 0.875 * height - 10)
        .attr("height", 20)
        .attr("width", width - 40)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 0.23 * width - 10)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.75 * height - 20)
        .attr("width", 20)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 0.77 * width - 10)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.75 * height - 20)
        .attr("width", 20)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 0.23 * width + 9)
        .attr("y", 0.5 * height - 10)
        .attr("height", 20)
        .attr("width", 0.54 * width - 15)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.75 * height - 20)
        .attr("width", 0.23 * width - 30)
        .attr("fill", "green");

    var leftMainText = court.append("text")
        .attr("y", 0.125 * height + 10 + (0.75 * height - 20) / 2 - 150)
        .attr("transform", "translate(" + (20 + (0.23 * width - 30) / 2) + ")");
    
    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Aces")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(stats.aces)
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Double faults")
        .attr("x", "0")
        .attr("dy", "75px")
        .attr("text-anchor", "middle");

    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(stats.doubleFaults)
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("First serve percentage")
        .attr("x", "0")
        .attr("dy", "75px")
        .attr("text-anchor", "middle");

    leftMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.fServeP) ? "0%" : (stats.fServeP * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    court.append("rect")
        .attr("x", 0.77 * width + 10)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.75 * height - 20)
        .attr("width", 0.23 * width - 30)
        .attr("fill", "green");

    var rightMainText = court.append("text")
        .attr("y", 0.125 * height + 10 + (0.75 * height - 20) / 2 - 150)
        .attr("transform", "translate(" + (0.77 * width + 10 + (0.23 * width - 30) / 2) + ")");
    
    rightMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Break points won")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    rightMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.bpConversion) ? "0%" : (stats.bpConversion * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    rightMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Break points saved")
        .attr("x", "0")
        .attr("dy", "180px")
        .attr("text-anchor", "middle");

    rightMainText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.retBpConversion) ? "0%" : (stats.retBpConversion * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");
    
    court.append("rect")
        .attr("x", 0.23 * width + 10)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.375 * height - 20)
        .attr("width", 0.27 * width - 20)
        .attr("fill", "green");

    var upperLeftText = court.append("text")
        .attr("y", 0.125 * height + 10 + (0.375 * height - 20) / 2 - 40)
        .attr("transform", "translate(" + (0.23 * width + 10 + (0.27 * width - 20) / 2) + ")");
    
    upperLeftText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("First serve points won")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    upperLeftText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.fServeWonP) ? "0%" : (stats.fServeWonP * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    court.append("rect")
        .attr("x", 0.23 * width + 10)
        .attr("y", 0.5 * height + 10)
        .attr("height", 0.375 * height - 20)
        .attr("width", 0.27 * width - 20)
        .attr("fill", "green");

    var lowerLeftText = court.append("text")
        .attr("y", 0.5 * height + 10 + (0.375 * height - 20) / 2 - 40)
        .attr("transform", "translate(" + (0.23 * width + 10 + (0.27 * width - 20) / 2) + ")");
    
    lowerLeftText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Second serve points won")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    lowerLeftText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.sServeWonP) ? "0%" : (stats.sServeWonP * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    court.append("rect")
        .attr("x", 0.5 * width + 10)
        .attr("y", 0.125 * height + 10)
        .attr("height", 0.375 * height - 20)
        .attr("width", 0.27 * width - 20)
        .attr("fill", "green");

    var upperRightText = court.append("text")
        .attr("y", 0.125 * height + 10 + (0.375 * height - 20) / 2 - 40)
        .attr("transform", "translate(" + (0.5 * width + 10 + (0.27 * width - 20) / 2) + ")");
    
    upperRightText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("First serve return points won")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    upperRightText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.retFServeWonP) ? "0%" : (stats.retFServeWonP * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    court.append("rect")
        .attr("x", 0.5 * width + 10)
        .attr("y", 0.5 * height + 10)
        .attr("height", 0.375 * height - 20)
        .attr("width", 0.27 * width - 20)
        .attr("fill", "green");

    var lowerRightText = court.append("text")
        .attr("y", 0.5 * height + 10 + (0.375 * height - 20) / 2 - 40)
        .attr("transform", "translate(" + (0.5 * width + 10 + (0.27 * width - 20) / 2) + ")");
    
    lowerRightText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text("Second serve return points won")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");
        
    lowerRightText.append("tspan")
        .attr("class", "courtText")
        .style("fill", "white")
        .text(Number.isNaN(stats.retSServeWonP) ? "0%" : (stats.retSServeWonP * 100).toFixed(2) + "%")
        .attr("x", "0")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 20)
        .attr("height", 0.125 * height - 30)
        .attr("width", 0.5 * width - 30)
        .attr("fill", "green");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 0.875 * height + 10)
        .attr("height", 0.125 * height - 30)
        .attr("width", 0.5 * width - 30)
        .attr("fill", "green");

    court.append("rect")
        .attr("x", 0.5 * width + 10)
        .attr("y", 20)
        .attr("height", 0.125 * height - 30)
        .attr("width", 0.5 * width - 30)
        .attr("fill", "green");

    court.append("rect")
        .attr("x", 0.5 * width + 10)
        .attr("y", 0.875 * height + 10)
        .attr("height", 0.125 * height - 30)
        .attr("width", 0.5 * width - 30)
        .attr("fill", "green");

    court.append("rect")
        .attr("x", 20)
        .attr("y", 0.5 * height - 10)
        .attr("height", 20)
        .attr("width", 0.01 * width)
        .attr("fill", "white");

    court.append("rect")
        .attr("x", width - 20 - 0.01 * width)
        .attr("y", 0.5 * height - 10)
        .attr("height", 20)
        .attr("width", 0.01 * width)
        .attr("fill", "white");
}
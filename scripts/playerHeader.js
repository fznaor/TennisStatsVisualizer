export function drawPlayerHeader(player){
    var mainDiv = d3.select("body").append("div").attr("class", "mainDiv");

    var info = mainDiv.append("div")
        .attr("class", "info");

    var flagAndHome = info.append("div")
        .attr("class", "flagAndHome");

    flagAndHome.append("a")
        .attr("class", "homeA")
        .attr("href", "index.php")
        .append("img")
        .attr("class", "homeImg")
        .attr("src", "images/home.png");

    flagAndHome.append("div")
        .attr("class", "flagDiv")
        .append("img")
        .attr("class", "flag")
        .attr("src", "https://www.countryflags.io/" + getTwoLetterCountryCode(player.country) + "/flat/64.png");

    info.append("img")
        .attr("class", "blur")
        .attr("src", "https://www.countryflags.io/" + getTwoLetterCountryCode(player.country) + "/flat/64.png");

    info.append("p")
        .attr("class", "playerName")
        .text(player.name + " " + player.surname);

    var variousInfo = info.append("div")
        .attr("class", "variousInfo");

    var dob = variousInfo.append("div").attr("class","DOBinfo");

    dob.append("img")
        .attr("class", "calenderImg")
        .attr("src", "images/calendar.png");

    dob.append("p")
        .attr("class", "playerDOB")
        .text(player.dob == "" ? "?" : d3.time.format("%d.%m.%Y.")(d3.time.format("%Y%m%d").parse(player.dob)));

    if(player.hand != "" && player.hand != "U"){
        variousInfo.append("img")
            .attr("class", "handImg")
            .attr("src", player.hand == "L" ? "images/left.png" : "images/right.png");
    }
    
    mainDiv.append("div")
        .attr("class", "load")
        .append("div")
        .attr("class", "dot-flashing");
}
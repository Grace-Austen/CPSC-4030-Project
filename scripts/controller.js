//style stuff
window.circle_r = 3
window.selectStroke = "white"
window.selectStrokeWidth = 3
window.selectCircle_r = 6
window.xAxisFontSize = 15
window.yAxisFontSize = 10
window.width_percentage = 1
window.scatter_plot_ratio = .2 //5 wide, 1 tall

continent_color_dict = {
    "Europe":"#ffffb3", //yellow
    "Africa":"#fdb462", //orange
    "North_America": "#bebada", //purple
    "Asia": "#80b1d3", //blue
    "Oceania": "#8dd3c7", //green
    "Latin_America_and_the_Carribean": "#fb8072"//red
}

window.dataset = d3.csv("data/combined_data/combined.csv")

periods = ["1950-1955", "1955-1960", "1960-1965", "1965-1970",
           "1970-1975", "1975-1980", "1980-1985", "1985-1990",
           "1990-1995", "1995-2000", "2000-2005", "2005-2010",
           "2010-2015", "2015-2020"]

currentPeriod = 0
window.selectedPeriod = periods[0]
window.selectedContinent = null
window.selectedCountry = null
window.playYears = true

function selectPeriod(chosen_year_bar) {
    currentPeriod = periods.findIndex(d => d === window.selectedPeriod)
    ch_yr_old = d3.selectAll(".year_bar")
                  .attr("stroke-opacity", 1)
                  .attr("stroke-width", d => d["year"] === window.selectedPeriod ? window.selectStrokeWidth : 0)

    countries = d3.selectAll(".country")
                .transition().duration(1000)
                .attr("fill", d => {
                    var countryInfo = window.q1dict.get(window.selectedPeriod).get(d.properties.ADMIN);
                    if(countryInfo !== undefined) {
                        return window.q1colorscale(countryInfo["SchoolYears"])
                    } else {
                        return "lightgrey"
                    }
                }) 

    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) {
        set = d3.selectAll(pointset).transition().duration(1000)
        set.attr("class", pointset.split(".")[1])
            .attr("r", d => {
                if(d["Period"] === window.selectedPeriod){
                    return d["Country"] === window.selectedCountry ? window.selectCircle_r : window.circle_r
                } else {
                    return 0
                }
            })
            .attr("stroke-width", 0)
            .filter(d => d["Country"] === window.selectedCountry)
            .attr("stroke", window.selectStroke)
            .attr("stroke-width", 1)
            .attr("class", pointset.split(".")[1] + " selected_points")
    }    
    selectedPoints = d3.selectAll(".selected_points")
                      .raise()
    setContinent()
}

function highlightCountry(selectedCountry) {
    //change text
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${selectedCountry}`)

    //highlight new point
    countries = d3.selectAll(".country")
                .filter(d => d.properties.ADMIN === selectedCountry)
                .attr("stroke-width", window.selectStrokeWidth)

    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) {
        set = d3.selectAll(pointset)
        set.filter(d => d["Period"] === window.selectedPeriod)
            .filter(d => d["Country"] === selectedCountry)
            .style("opacity", 1)
            .attr("r", window.selectCircle_r)
            .attr("stroke", window.selectStroke)
            .attr("stroke-width", 1)
            .raise()
    }

    //make remove old point stroke
    if(selectedCountry !== window.selectedCountry){
        countries = d3.selectAll(".country")
                    .filter(d => d.properties.ADMIN === window.selectedCountry)
                    .attr("stroke-opacity", 0.5)

        for(var pointset of points) {
            set = d3.selectAll(pointset)
            set.filter(d => d["Period"] === window.selectedPeriod)
                .filter(d => d["Country"] === window.selectedCountry)
                .attr("stroke-width", 0)
        }        
    }
}

function unhighlightCountry(selectedCountry) {
    //changing selected country text
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)

    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    
    //make selected country normal and lower it
    if(selectedCountry !== window.selectedCountry){
        countries = d3.selectAll(".country")
                    .filter(d => d.properties.ADMIN === selectedCountry)
                    .attr("stroke-width", .75)
        for(var pointset of points) {
            set = d3.selectAll(pointset)
            set.filter(d => d["Period"] === window.selectedPeriod)
                .filter(d => d["Country"] === selectedCountry)
                .style("opacity", d => {
                    currentContinent = d["Continent"]
                    if(window.selectedContinent === null) {
                        return 1
                    } else {
                        return currentContinent === window.selectedContinent ? 1 : 0
                    }
                })
                .attr("r", window.circle_r)
                .attr("stroke-width", 0)
        }
    }

    //bring opacity back of selected country and raise it
    countries = d3.selectAll(".country")
                .filter(d => d.properties.ADMIN === window.selectedCountry)
                .attr("stroke-opacity", 1)
    for(var pointset of points) {
        set = d3.selectAll(pointset)
        set.filter(d => d["Period"] === window.selectedPeriod)
            .filter(d => d["Country"] === window.selectedCountry)
            .attr("stroke-width", 1)
            .raise()
    }
}

function selectCountry(){
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)

    var countries = d3.selectAll(".country")
    
    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]

    //reset all the things
    countries.attr("stroke-width", .75)
    for(var pointset of points) {
        set = d3.selectAll(pointset)
        set.filter(d => d["Period"] === window.selectedPeriod)
            .attr("r", window.circle_r)
            .attr("stroke-width", 0)
            .style("opacity", d => {
                currentContinent = d["Continent"]
                if(window.selectedContinent === null) {
                    return 1
                } else {
                    return currentContinent === window.selectedContinent ? 1 : 0}
                })
    }

    if (window.selectedCountry !== null) { //highlight relevant stuff
        countries.filter(d => d.properties.ADMIN == window.selectedCountry)
                .attr("stroke-width", window.selectStrokeWidth)
        for(var pointset of points) {
            set = d3.selectAll(pointset)
            set.filter(d => d["Period"] === window.selectedPeriod)
                .filter(d => d["Country"] === window.selectedCountry)
                .attr("r", window.selectCircle_r)
                .attr("stroke", window.selectStroke)
                .attr("stroke-width", 1)
                .style("opacity", 1)
                .raise()
        }
    }
}

function highlightContinent(selectedContinent) { //really just want everything else to be opaque on hover
    //highlight new point
    // countries = d3.selectAll(".country")
    //             .filter(d => d.properties.ADMIN === selectedCountry)
    //             .attr("stroke-width", window.selectStrokeWidth)
    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) { //translucent relevant points
        set = d3.selectAll(pointset).filter(d => d["Period"] === window.selectedPeriod)
        set.style("opacity", d => {
            var thisContinent = d["Continent"]
            if(thisContinent === selectedContinent) {
                return 1
            } else {
                if (window.selectedContinent === null) {
                    return .3
                } else {
                    return thisContinent === window.selectedContinent ? 0.5 : 0 
                }
            }
        })
        .filter(d => d["Continent"] !== selectedContinent)
          .lower()
        set.filter(d => d["Continent"] === selectedContinent) //update radius of points for hover continent 
            .attr("r", window.circle_r)
        set.filter(d => d["Country"] === window.selectedCountry)
            .attr("r", window.selectCircle_r)
            .attr("stroke", window.selectStroke)
            .attr("stroke-width", 1)
            .style("opacity", 1)
            .raise()
    }
}

function unhighlightContinent() { //really just want everything else to be opaque on hover
    //highlight new point
    // countries = d3.selectAll(".country")
    //             .filter(d => d.properties.ADMIN === selectedCountry)
    //             .attr("stroke-width", window.selectStrokeWidth)
    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) {
        set = d3.selectAll(pointset).filter(d => d["Period"] === window.selectedPeriod)
        set.style("opacity", d => {
                var thisContinent = d["Continent"]
                if (window.selectedContinent === null) {
                    return 1
                } else {
                    return thisContinent === window.selectedContinent ? 1 : 0 
                }
            })
            .attr("r", d => {
                var thisContinent = d["Continent"]
                if (window.selectedContinent === null) {
                    return window.circle_r
                } else {
                    return thisContinent === window.selectedContinent ? window.circle_r : 0 
                }
            })
        set.filter(d => d["Country"] === window.selectedCountry)
            .attr("r", window.selectCircle_r)
            .attr("stroke", window.selectStroke)
            .attr("stroke-width", 1)
            .style("opacity", 1)
            .raise()
    }
}

function setContinent() { //really just want everything else to be opaque on hover
    //highlight new point
    // countries = d3.selectAll(".country")
    //             .filter(d => d.properties.ADMIN === selectedCountry)
    //             .attr("stroke-width", window.selectStrokeWidth)
    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) {
        set = d3.selectAll(pointset).filter(d => d["Period"] === window.selectedPeriod)
        set.transition().duration(1000)
        .style("opacity", d => {
            var thisContinent = d["Continent"]
            if (window.selectedContinent === null || d["Country"] === window.selectedCountry) {
                return 1
            } else {
                return thisContinent === window.selectedContinent ? 1 : 0 
            }
        })
        .attr("r", d => {
            var thisContinent = d["Continent"]
            if (window.selectedContinent === null) {
                return d["Country"] === window.selectedCountry ? window.selectCircle_r : window.circle_r
            } else {
                if(d["Country"] === window.selectedCountry) {
                    return window.selectCircle_r
                }
                return thisContinent === window.selectedContinent ? window.circle_r : 0 
            }
        })
        set.filter(d => d["Country"] === window.selectedCountry)
            .attr("stroke", window.selectStroke)
            .attr("stroke-width", 1)
            .style("opacity", 1)
            .raise()
    }
}

intervalVar = null
play_button = document.getElementById("play_button")

play_button.onclick = function(){
        if(intervalVar === null){
            playThroughYears()
        } else {
            stopPlay()
        }
    }

function playThroughYears(){ //don't want mult intervals to be set at once
    if(intervalVar === null){
        play_button.innerText = "Pause"
        intervalVar = window.setInterval(updateYear, 1500)
    }
}
function stopPlay(){ //don't want to break things if you pass in null
    if(intervalVar !== null) {
        play_button.innerText = "Play"
        window.clearInterval(intervalVar)
        intervalVar = null
    }
}

function updateYear(){
    currentPeriod = (currentPeriod+1)%14
    window.selectedPeriod = periods[currentPeriod]
    selectPeriod()
}
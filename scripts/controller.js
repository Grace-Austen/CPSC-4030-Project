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
window.hoverContinent = null
window.selectedContinent = null
window.hoverCountry = null
window.selectedCountry = "United States of America" 
window.playYears = true

function update(type, value){
    if(type === "highlightCountry"){
        window.hoverCountry = value
    }
    if(type === "highlightContinent"){
        window.hoverContinent = value
    }
    currentPeriod = periods.findIndex(d => d === window.selectedPeriod) //no idea what this is here for, it ties in to the autoscrolling bar thing I think
    
    ch_yr_old = d3.selectAll(".year_bar") //update period bar appearance
                  .attr("stroke-opacity", 1)
                  .attr("stroke-width", d => d["year"] === window.selectedPeriod ? window.selectStrokeWidth : 0)

    //update country colorscale, only required for period change
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

    //update all the viz points
    points = [".q2-points", ".school_points", ".fertility_points", ".q4-circle"]
    for(var pointset of points) {
        set = d3.selectAll(pointset)
        set_trainsitionable = set.transition().duration(1000)
        set_trainsitionable
            .attr("r", d => { //choose visibility based on period, selected continent, and selected country
                if(d["Period"] !== window.selectedPeriod){
                    return 0
                } else if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry){
                    return window.selectCircle_r
                } else {
                    if(window.selectedContinent !== null) {
                        if(d["Continent"] === window.selectedContinent || d["Continent"] === window.hoverContinent) {
                            return window.circle_r
                        } else {
                            return 0
                        }
                    }
                    return window.circle_r
                }
            })
            .style("opacity", d => { //opacity based on continent and country
                if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry) {
                    return 1
                }
                if(window.hoverContinent === null) {
                    if(window.selectedContinent === null) {
                        return 1
                    } else {
                        if(d["Continent"] === window.selectedContinent) {
                            return 1
                        } else {
                            return 0.5
                        }
                    }
                } else {
                    if(d["Continent"] === window.hoverContinent) {
                        return 1
                    } else {
                        return 0.5
                    }
                }
            })
            .attr("stroke", d => { //stroke based on period and selected country
                if(d["Period"] !== window.selectedPeriod){
                    return null
                } else if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry){
                    return window.selectStroke
                } else {
                    return null
                }
            })
            .attr("stroke-width", d => { //stroke width based on period and selected country
                if(d["Period"] !== window.selectedPeriod){
                    return 0
                } else {
                    if(window.hoverCountry === null) {
                        if(d["Country"] === window.selectedCountry){
                            return 1
                        } else {
                            return 0
                        }
                    } else {
                        if(d["Country"] === window.hoverCountry){
                            return 1
                        } else {
                            return 0
                        }
                        
                    }
                }    
            })
        set.filter(d => { //raise all selected items
            scountry = d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry
            scontinent = d["Country"] === window.selectedContinent || d["Country"] === window.hoverContinent
            return scountry || scontinent})
           .raise()
    }
    q3_lines = d3.selectAll(".q3-lines")
    q3_lines_trainsitionable = q3_lines.transition().duration(1000)
    q3_lines_trainsitionable
        .attr("width", d => { //choose visibility based on period, selected continent, and selected country
            if(d["Period"] !== window.selectedPeriod){
                //console.log("yes")
                return 0
            } else if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry){
                return window.selectCircle_r
            } else {
                if(window.selectedContinent !== null) {
                    if(d["Continent"] === window.selectedContinent || d["Continent"] === window.hoverContinent) {
                        return window.circle_r
                    } else {
                        return 0
                    }
                }
                return window.circle_r
            }
        })
        .style("transform", d => {
            if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry) {
                return `translateX(-${window.selectCircle_r/2}px)`
            } else {
                return `translateX(-${window.circle_r/2}px)`
            }
        })
        .style("opacity", d => { //opacity based on continent and country
            if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry) {
                return 1
            }
            if(window.hoverContinent === null) {
                if(window.selectedContinent === null) {
                    return 1
                } else {
                    if(d["Continent"] === window.selectedContinent) {
                        return 1
                    } else {
                        return 0.5
                    }
                }
            } else {
                if(d["Continent"] === window.hoverContinent) {
                    return 1
                } else {
                    return 0.5
                }
            }
        })
        .attr("stroke", d => { //stroke based on period and selected country
            if(d["Period"] !== window.selectedPeriod){
                return null
            } else if(d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry){
                return window.selectStroke
            } else {
                return null
            }
        })
        .attr("stroke-width", d => { //stroke width based on period and selected country
            if(d["Period"] !== window.selectedPeriod){
                return 0
            } else {
                if(window.hoverCountry === null) {
                    if(d["Country"] === window.selectedCountry){
                        return 1
                    } else {
                        return 0
                    }
                } else {
                    if(d["Country"] === window.hoverCountry){
                        return 1
                    } else {
                        return 0
                    }
                    
                }
            }    
        })
    q3_lines.filter(d => { //raise all selected items
        scountry = d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry
        scontinent = d["Country"] === window.selectedContinent || d["Country"] === window.hoverContinent
        return scountry || scontinent})
       .raise()
}

window.intervalVar = null

function playThroughYears(){ //don't want mult intervals to be set at once
    if(window.intervalVar === null){
        play_button = d3.select("#play_button_text")
        play_button.text("Pause")
        window.intervalVar = window.setInterval(updateYear, 1500)
        updateYear()
    }
}
function stopPlay(){ //don't want to break things if you pass in null
    if(window.intervalVar !== null) {
        play_button = d3.select("#play_button_text")
        play_button.text("Play")
        window.clearInterval(window.intervalVar)
        window.intervalVar = null
    }
}

function updateYear(){
    currentPeriod = (currentPeriod+1)%14
    window.selectedPeriod = periods[currentPeriod]
    update()
    // selectPeriod()
}

function displayTooltip(event){
    //tooltip on hovering
    if(window.hoverCountry !== null) {
        ttd = document.getElementById("tooltip-div")
        ttd.innerHTML = `<p id="tooltip-text">Country: ${hoverCountry}</p>`
        sY = event.clientY
        sX = event.clientX
        console.log(event, "x", sX, "y", sY)
        ttd.style.top = `${sY}px`
        ttd.style.left = `${sX}px`
    } else {
        ttd = document.getElementById("tooltip-div")
        ttd.innerHTML = ""
    }
}
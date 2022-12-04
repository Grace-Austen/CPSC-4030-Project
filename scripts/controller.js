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
window.selectedCountry = null 
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
    points = [".q2-points", ".school_points", ".fertility_points"]
    for(var pointset of points) {
        set = d3.selectAll(pointset)
        set_trainsitionable = set.transition().duration(1000)
        set_trainsitionable
            .attr("r", d => { //choose visibility based on period, selected continent, and selected country
                if(d["Country"] === window.selectedCountry) {
                    return window.selectCircle_r
                } else if(d["Period"] !== window.selectedPeriod){
                    return 0
                } else if(d["Country"] === window.hoverCountry){
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
                    } else if(d["Country"] === window.hoverCountry){
                        return 1
                    } else {
                        return 0
                    }
                }    
            })
        set.filter(d => { //raise all selected items
            scountry = d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry
            scontinent = d["Continent"] === window.hoverContinent
            return scountry || scontinent})
           .raise()
    }
    q3_lines = d3.selectAll(".q3-lines")
    q3_lines_trainsitionable = q3_lines.transition().duration(1000)
    q3_lines_trainsitionable
        .attr("width", d => { //choose visibility based on period, selected continent, and selected country
            if(d["Country"] === window.selectedCountry){
                return window.selectCircle_r
            } else if(d["Period"] !== window.selectedPeriod){
                return 0
            } else if(d["Country"] === window.hoverCountry){
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
        .style("transform", d => { //making the rectangle lines nicely aligned
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
                } else if(d["Country"] === window.hoverCountry){
                    return 1
                } else {
                    return 0
                }
            }    
        })
    q3_lines.filter(d => { //raise all selected items
        scountry = d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry
        scontinent = d["Continent"] === window.hoverContinent
        return scountry || scontinent})
       .raise()

    //Update q4 lines as countries are selected, setting their opacity
    var q4_lines = d3.selectAll(".q4-lines");
    var q4_transition = q4_lines.transition().duration(1000);

    q4_transition
        .attr("stroke-width", d => {
            //if a country is selected, only select that country, the continents if relevant, and hover
            if(window.selectedCountry !== null){
                if(d["Country"] === window.selectedCountry){ 
                    return window.selectStrokeWidth
                } else if(d["Period"] !== window.selectedPeriod){
                    return 0
                } else if(d["Country"] === window.hoverCountry){
                    return window.selectStrokeWidth
                } else {
                    if(d["Continent"] === window.selectedContinent || d["Continent"] === window.hoverContinent) {
                        return 1
                    } else {
                        return 0
                    }
                }
            } else {
                if(d["Period"] !== window.selectedPeriod){
                    return 0
                } else if(d["Country"] === window.hoverCountry){
                    return window.selectStrokeWidth
                } else {
                    if(window.selectedContinent !== null || window.hoverContinent !== null) {
                        if(d["Continent"] === window.selectedContinent || d["Continent"] === window.hoverContinent) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                    return 1
                }
            }
            
        })
        .attr("opacity", d => {
            //if a country is hovered over, it is full opacity, the selected country if applicable is not as opaque and neither are the selected continent
            //if a country is selected, it and continent are even opaqueness
            //if a continent is selected, then it is opaque
            //if a continent is hovered over, it is full opacity and the selected continent is opque, country is unaffected
            if(window.hoverCountry !== null) {
                if(d["Country"] === window.hoverCountry) {
                    if(d["Period"] === window.selectedPeriod){
                        return 1
                    } else {
                        return .5
                    }
                } else {
                    return .3
                }
            } else {
                if(d["Country"] === window.selectedCountry) {
                    if(d["Period"] === window.selectedPeriod){
                        return 1
                    } else {
                        return .5
                    }
                }
                if(window.hoverContinent !== null) {
                    if(d["Continent"] === window.hoverContinent) {
                        return 1
                    } else if(d["Continent"] === window.selectedContinent){
                        return .5
                    } else {
                        return .3 //everything else
                    }
                } else {
                    return 1
                }
            }
        })
    q4_lines.filter(d => { //raise all selected items
        scountry = d["Country"] === window.selectedCountry || d["Country"] === window.hoverCountry
        scontinent = d["Continent"] === window.hoverContinent
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

function displayTooltip(event, period){
    //tooltip on hovering
    ttd = document.getElementById("tooltip-div")
    ttd.innerHTML = `<p id="tooltip-text">${hoverCountry}
                    <br>${period}
                    </p>`
    sY = event.pageY + 5
    sX = event.pageX + 5
    // console.log(event, "x", sX, "y", sY)
    ttd.style.top = `${sY}px`
    ttd.style.left = `${sX}px`
}

function removeToolTip(){
    ttd = document.getElementById("tooltip-div")
    ttd.innerHTML = ""
}
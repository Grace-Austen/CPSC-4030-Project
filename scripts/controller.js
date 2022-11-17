window.circle_r = 3
window.selectStroke = 3

window.continents = ['Asia', 'Europe', 'Africa', 'Latin_America_and_the_Carribean', 'Oceania', 'North_America']
window.continentColors = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
window.colorForCountry = colorForCountry

window.dataset = d3.csv("data/combined_data/combined.csv")

window.selectedCountry = null
window.selectedPeriod = "2010-2015"
function highlightCountry(selectedCountry) {
    //change text
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${selectedCountry}`)

    //highlight new point
    countries = d3.selectAll(".country")
                .filter(d => d.properties.ADMIN === selectedCountry)
                .attr("stroke-width", window.selectStroke)

    school_points = d3.selectAll(".school_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .filter(d => d["Country"] === selectedCountry)
                      .attr("r", 6)
                      .attr("stroke", "grey")
                      .attr("stroke-width", 1)
                      .raise()
    fertility_points = d3.selectAll(".fertility_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .filter(d => d["Country"] === selectedCountry)
                      .attr("r", 6)
                      .attr("stroke", "grey")
                      .attr("stroke-width", 1)
                      .raise()

    q2_points = d3.selectAll(".q2-points")
                  .filter(d => d["Period"] === window.selectedPeriod)
                  .filter(d => d["Country"] === selectedCountry)
                  .attr("r", 6)
                  .attr("stroke", "grey")
                  .attr("stroke-width", 1)
                  .raise()

    q4_points = d3.selectAll(".q4-circle")
                .filter(d => d["Period"] === window.selectedPeriod)
                .filter(d => d["Country"] == selectedCountry)
                .attr("r", 6)
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .raise();

    //make old point opaque
    if(selectedCountry !== window.selectedCountry){
        countries = d3.selectAll(".country")
                    .filter(d => d.properties.ADMIN === window.selectedCountry)
                    .attr("stroke-opacity", 0.5)
        school_points = d3.selectAll(".school_points")
                        .filter(d => d["Period"] === window.selectedPeriod)
                        .filter(d => d["Country"] === window.selectedCountry)
                        .attr("stroke-width", 0)
        fertility_points = d3.selectAll(".fertility_points")
                            .filter(d => d["Period"] === window.selectedPeriod)
                            .filter(d => d["Country"] === window.selectedCountry)
                            .attr("stroke-width", 0)

        q2_points = d3.selectAll(".q2-points")
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .filter(d => d["Country"] === window.selectedCountry)
                    .attr("stroke-width", 0)

        q4_points = d3.selectAll(".q4-circle")
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .filter(d => d["Country"] == window.selectedCountry)
                    .attr("stroke-width", 0)
    }
}

function unhighlightCountry(selectedCountry) {
    //changing selected country text
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)

    //make selected country normal and lower it
    if(selectedCountry !== window.selectedCountry){
        countries = d3.selectAll(".country")
                    .filter(d => d.properties.ADMIN === selectedCountry)
                    .attr("stroke-width", .75)
        school_points = d3.selectAll(".school_points")
                        .filter(d => d["Period"] === window.selectedPeriod)
                        .filter(d => d["Country"] === selectedCountry)
                        .attr("r", window.circle_r)
                        .attr("stroke-width", 0)
        fertility_points = d3.selectAll(".fertility_points")
                            .filter(d => d["Period"] === window.selectedPeriod)
                            .filter(d => d["Country"] === selectedCountry)
                            .attr("r", window.circle_r)
                            .attr("stroke-width", 0)

        q2_points = d3.selectAll(".q2-points")
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .filter(d => d["Country"] === selectedCountry)
                    .attr("r", window.circle_r)
                    .attr("stroke-width", 0)

        q4_points = d3.selectAll(".q4-circle")
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .filter(d => d["Country"] === selectedCountry)
                    .attr("r", window.circle_r)
                    .attr("stroke-width", 0)
    }

    //bring opacity back of selected country and raise it
    countries = d3.selectAll(".country")
                .filter(d => d.properties.ADMIN === window.selectedCountry)
                .attr("stroke-opacity", 1)
    school_points = d3.selectAll(".school_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .filter(d => d["Country"] === window.selectedCountry)
                      .attr("stroke-width", 1)
                      .raise()
    fertility_points = d3.selectAll(".fertility_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .filter(d => d["Country"] === window.selectedCountry)
                      .attr("stroke-width", 1)
                      .raise()
    
    q2_points = d3.selectAll(".q2-points")
                  .filter(d => d["Period"] === window.selectedPeriod)
                  .filter(d => d["Country"] === window.selectedCountry)
                  .attr("stroke-width", 1)
                  .raise()

    q4_points = d3.selectAll(".q4-circle")
                .filter(d => d["Period"] === window.selectedPeriod)
                .filter(d => d["Country"] === window.selectedCountry)
                .attr("stroke-width", 1)
                .raise()
}

function selectCountry(){
    countrySelectedText = d3.select("#countrySelectedText")
                            .text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)

    var countries = d3.selectAll(".country")
    var school_points = d3.selectAll(".school_points").filter(d => d["Period"] === window.selectedPeriod)
    var fertility_points = d3.selectAll(".fertility_points").filter(d => d["Period"] === window.selectedPeriod)
    var q2_points = d3.selectAll(".q2-points").filter(d => d["Period"] === window.selectedPeriod)
    var q4_points = d3.selectAll(".q4-circle").filter(d => d["Period"] === window.selectedPeriod)

    //reset all the things
    countries.attr("stroke-width", .75)
    school_points.attr("r", window.circle_r)
                .attr("stroke-width", 0)
    fertility_points.attr("r", window.circle_r)
                    .attr("stroke-width", 0)
    q2_points.attr("r", window.circle_r)
            .attr("stroke-width", 0)
    q4_points.attr("r", window.circle_r)
            .attr("stroke-width", 0)
    if (window.selectedCountry !== null) { //highlight relevant stuff
        countries.filter(d => d.properties.ADMIN == window.selectedCountry)
                .attr("stroke-width", window.selectStroke)
        school_points.filter(d => d["Country"] === window.selectedCountry)
                    .attr("r", 6)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .raise()
        fertility_points.filter(d => d["Country"] === window.selectedCountry)
                    .attr("r", 6)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .raise()
        q2_points.filter(d => d["Country"] === window.selectedCountry)
                    .attr("r", 6)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .raise()
        q4_points.filter(d => d["Country"] === window.selectedCountry)
                    .attr("r", 6)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .raise()
    }
}

function selectPeriod(chosen_year_bar) {
    ch_yr_old = d3.selectAll("#chosen_year")
                  .attr("id", null)
                  .attr("stroke-opacity", 1)
                  .attr("stroke-width", 0)
    chosen_year_bar.attr("stroke-width", window.selectStroke)
                   .attr("id", "chosen_year")

    countries = d3.selectAll(".country")
                .transition().duration(1000)
                .attr("fill", d => {
                    var countryInfo = window.q1dict.get(window.selectedPeriod).get(d.properties.ADMIN);
                    if(countryInfo !== undefined) {
                        return window.q1colorscale(countryInfo["SchoolYears"])
                    } else {
                        return "black"
                    }
                }) 
    
    q2_points = d3.selectAll(".q2-points").transition().duration(1000)
                  .attr("class", "q2-points")
                  .attr("r", d => {
                    if(d["Period"] === window.selectedPeriod){
                        return d["Country"] === window.selectedCountry ? 6 : window.circle_r
                    } else {
                        return 0
                    }
                  })
                  .attr("stroke-width", 0)
                  .filter(d => d["Country"] === window.selectedCountry)
                  .attr("stroke", "grey")
                  .attr("stroke-width", 1)
                  .attr("class", "q2-points selected_points")
                 
    q3_fert_points = d3.selectAll(".fertility_points").transition().duration(1000)
                       .attr("class", "fertility_points")
                       .attr("r", d => {
                         if(d["Period"] === window.selectedPeriod){
                             return d["Country"] === window.selectedCountry ? 6 : window.circle_r
                         } else {
                             return 0
                         }
                       })
                       .attr("stroke-width", 0)
                       .filter(d => d["Country"] === window.selectedCountry)
                       .attr("stroke", "grey")
                       .attr("stroke-width", 1)
                       .attr("class", "fertility_points selected_points")
    q3_school_points = d3.selectAll(".school_points").transition().duration(1000)
                  .attr("class", "school_points")
                  .attr("r", d => {
                    if(d["Period"] === window.selectedPeriod){
                        return d["Country"] === window.selectedCountry ? 6 : window.circle_r
                    } else {
                        return 0
                    }
                  })
                  .attr("stroke-width", 0)
                  .filter(d => d["Country"] === window.selectedCountry)
                  .attr("stroke", "grey")
                  .attr("stroke-width", 1)
                  .attr("class", "school_points selected_points")

    q4_points = d3.selectAll(".q4-circle").transition().duration(1000)
                  .attr("class", "q4-circle")
                  .attr("r", d => {
                    if(d["Period"] === window.selectedPeriod){
                        return d["Country"] === window.selectedCountry ? 6 : window.circle_r
                    } else {
                        return 0
                    }
                  })
                  .attr("stroke-width", 0)
                  .filter(d => d["Country"] === window.selectedCountry)
                  .attr("stroke", "grey")
                  .attr("stroke-width", 1)
                  .attr("class", "q4-circle selected_points")

    selectedPoints = d3.selectAll(".selected_points")
                      .raise()
}


function colorForCountry(currentContinent){
    var index = 0
    for(let continent of window.continents){
        if(continent == currentContinent){
            return index 
        }
        else{
            index++
        }
        
    }
}
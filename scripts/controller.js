window.circle_r = 3
window.selectStroke = 3

window.continents = ['Asia', 'Europe', 'Africa', 'Latin_America_and_the_Carribean', 'Oceania', 'North_America']
window.dataset = d3.csv("data/combined_data/combined.csv")
window.selectedCountry = null
window.selectedPeriod = "2010-2015"
function selectCountry() {
    school_points = d3.selectAll(".school_points")
                      .filter(d => d["Country"] === window.selectedCountry)
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .attr("r", 6)
                      .attr("stroke", "grey")
                      .attr("stroke-width", 1)
                      .raise()
    fertility_points = d3.selectAll(".fertility_points")
                      .filter(d => d["Country"] === window.selectedCountry)
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .attr("r", 6)
                      .attr("stroke", "grey")
                      .attr("stroke-width", 1)
                      .raise()

    q2_points = d3.selectAll(".q2-points")
                  .filter(d => d["Period"] === window.selectedPeriod)
                  .filter(d => d["Country"] === window.selectedCountry)
                  .attr("r", 6)
                  .attr("stroke", "grey")
                  .attr("stroke-width", 1)
                  .raise()
}

function deselectCountry() {
    school_points = d3.selectAll(".school_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .attr("r", 3)
                      .attr("stroke-width", 0)
                      .lower()
    fertility_points = d3.selectAll(".fertility_points")
                      .filter(d => d["Period"] === window.selectedPeriod)
                      .attr("r", 3)
                      .attr("stroke-width", 0)
                      .lower()
    
    q2_points = d3.selectAll(".q2-points")
                  .filter(d => d["Period"] === window.selectedPeriod)
                  .attr("r", 3)
                  .attr("stroke-width", 0)
                  .lower()
}

function selectPeriod(chosen_year_bar) {
    ch_yr_old = d3.selectAll("#chosen_year")
                  .attr("id", null)
                  .attr("stroke-opacity", 1)
                  .attr("stroke-width", 0)
    chosen_year_bar.attr("stroke-width", window.selectStroke)
                   .attr("id", "chosen_year")
    q2_points = d3.selectAll(".q2-points")
                  .transition().duration(1000)
                  .style("opacity", d => d["Period"] === window.selectedPeriod ? 1 : 0)
    countries = d3.selectAll(".country")
                .transition().duration(1000)
                .attr("fill", d => window.q1colorscale(window.q1dict.get(window.selectedPeriod).get(d.properties.ADMIN)))
    q3_fert_points = d3.selectAll(".fertility_points")
                       .transition().duration(1000)
                       .attr("r", d => d["Period"] === window.selectedPeriod ? 3 : 0)
    q3_school_points = d3.selectAll(".school_points")
                       .transition().duration(1000)
                       .attr("r", d => d["Period"] === window.selectedPeriod ? 3 : 0)
    q4_points = d3.selectAll(".q4-circle")
                  .transition().duration(1000)
                  .style("opacity", d => d["Period"] === window.selectedPeriod ? 1 : 0);
}
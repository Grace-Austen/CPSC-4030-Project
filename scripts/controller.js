function selectCountry() {
    school_points = d3.selectAll(".school_points")
                      .filter(d => d["Country"] === window.selectedCountry)
                      .attr("stroke", "darkgrey")
                      .attr("fill", "grey")
                      .attr("r", 6)
}

function deselectCountry() {
    school_points = d3.selectAll(".school_points")
                      .attr("stroke", "none")
                      .attr("fill", "black")
                      .attr("r", 3)
}
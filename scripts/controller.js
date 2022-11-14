window.selectedPeriod = "2010-2015"
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

function test(d){
    console.log(d)
    console.log(window.selectedPeriod)
    if(d["period"] !== window.selectedPeriod){
        return 0
    }
    else{
        return 1
    }
}

function selectPeriod() {
    q2_points = d3.selectAll(".q2-points")
                  .style("opacity", d => d["period"] === window.selectedPeriod ? 1 : 0)
    q4_points = d3.selectAll(".q4-circle")
                    .style("opacity", d => d["Period"] === window.selectedPeriod ? 1 : 0);
}
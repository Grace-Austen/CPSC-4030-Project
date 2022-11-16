d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select the svg we will be using
    var svg = d3.select("#q4-viz");
    
    console.log(window.selectedPeriod)

    //Setup dimensions
    var dims = {
        width: .9 * window.screen.width,
        height: 300,
        margin: {
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    };

    //Set the width and height for the svg
    svg.style("width", dims.width);
    svg.style("height", dims.height);

    //Create x and y scales
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, d => +d["Years"]))
                    .range([dims.margin.left, dims.width - dims.margin.right]);

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, d => +d["Net"]))
                    .range([dims.height - dims.margin.bottom, dims.margin.top]);
    
    //Add x and y axes
    svg.append("g").call(d3.axisBottom().scale(xScale))
                    .style("transform", `translateY(${yScale(0)}px)`);
    svg.append("g").call(d3.axisLeft().scale(yScale))
                    .style("transform", `translateX(${dims.margin.left}px)`);

    //Add dots
    svg.append("g")
        .selectAll(".q4-circle")
        .data(dataset)
        .enter()
        .append("circle")
        .style("opacity", d => d["Period"] === window.selectedPeriod ? 1 : 0)
        .attr("class", "q4-circle")
        .attr("cx", d => xScale(+d["Years"]))
        .attr("cy", d => yScale(+d["Net"]))
        .attr("r", 2)
        .attr("fill", "blue");
    
    // //Sort x values
    // dataset.sort((a, b) => {
    //     return(a["Years"] - b["Years"]);
    // });

    // //Add line to points
    // svg.append("path")
    //     .datum(dataset)
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1)
    //     .attr("d", d3.line()
    //         .x(d => +xScale(+d["Years"]))
    //         .y(d => +yScale(+d["Net"]))
    //     );
})
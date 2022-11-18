d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select the svg we will be using
    var svg = d3.select("#q4-viz");
    var container = document.getElementById("q4-container")
    
    //Setup dimensions
    var dims = {
        width: window.width_percentage * container.clientWidth,
        height: window.scatter_plot_ratio * window.width_percentage * container.clientWidth,
        margin: {
            top: 10,
            bottom: 30 + window.xAxisFontSize,
            right: 10,
            left: 50 + 2*window.yAxisFontSize
        }
    };
    
    //Set the width and height for the svg
    svg.style("width", dims.width);
    svg.style("height", dims.height);

    //variable accessors
    var schoolAccessor = d => +d["Years"]
    var netMigrAccessor = d => +d["Net"]

    //Create x and y scales
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, schoolAccessor))
                    .range([dims.margin.left, dims.width - dims.margin.right]);
    var yScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, netMigrAccessor))
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
        .attr("class", "q4-circle")
        .attr("cx", d => xScale(schoolAccessor(d)))
        .attr("cy", d => yScale(netMigrAccessor(d)))
        .attr("fill", d => window.continent_color_dict[d["Continent"]])
        .on("mouseover", function(){
            if(d3.select(this)["_groups"][0][0]["__data__"]["Period"] === window.selectedPeriod){
                highlightCountry(d3.select(this)["_groups"][0][0]["__data__"]["Country"])
            }
        })
        .on("mouseout", function(){
             if(d3.select(this)["_groups"][0][0]["__data__"]["Period"] === window.selectedPeriod){
                unhighlightCountry(d3.select(this)["_groups"][0][0]["__data__"]["Country"])
             }  
        })
        .on("click", function(){
            var thisData = d3.select(this)["_groups"][0][0]["__data__"]
            if(thisData["Period"] === window.selectedPeriod) {
                var thisCountry = thisData["Country"]
                window.selectedCountry = (window.selectedCountry === thisCountry ? null : thisCountry)
                selectCountry()
            }
        })
        .filter(d => d["Period"] === window.selectedPeriod)
        .attr("r", window.circle_r);

    //Add labels
    svg.append("g")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", window.xAxisFontSize)
        .attr("x", dims.width / 2)
        .attr("y", dims.height - dims.margin.bottom + 2.5*window.xAxisFontSize)
        .text("Mean Years of Schooling");

    svg.append("g")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90, ${dims.margin.left - (window.yAxisFontSize*5)}, ${dims.margin.top + (dims.height-dims.margin.top-dims.margin.bottom)/2})`)
        .attr("font-size", window.yAxisFontSize)
        .attr("x", dims.margin.left - window.yAxisFontSize*5)
        .attr("y", dims.margin.top + (dims.height-dims.margin.top-dims.margin.bottom)/2)
        .text("Average Migration Rate");
})
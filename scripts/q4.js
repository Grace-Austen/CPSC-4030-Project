d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select the svg we will be using
    var svg = d3.select("#q4-viz");
    var container = document.getElementById("q4-container")
    //Setup dimensions
    var dims = {
        width: .95 * container.clientWidth,
        height: 200,
        margin: {
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    };
    
    //Setup color wheel
    var color = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];    

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
        .attr("class", "q4-circle")
        .attr("cx", d => xScale(+d["Years"]))
        .attr("cy", d => yScale(+d["Net"]))
        .attr("fill", d => color[colorForCountry(d["Continent"])])
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
        .attr("r", window.circle_r)

})
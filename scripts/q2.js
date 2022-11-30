d3.csv("data/q2_data/q2.csv").then((dataset) => {
    var container = document.getElementById("q4-container")
    var svg = d3.select("#q2-viz")

    var dimensions = {
        height: container.clientHeight / 2,
        width: window.width_percentage * container.clientWidth,
        margin:{
            top: 10,
            bottom: 30 + window.xAxisFontSize,
            right: 10,
            left: 50 + 2*window.yAxisFontSize
        }
    }

    svg
        .style("width", dimensions.width)
        .style("height", dimensions.height)

    var yearsDiffAccessor = d => +d["YearsDifference"]
    var fertilityAccessor = d => +d["Rate"]

    var xScale = d3.scaleLinear()
                   .domain(d3.extent(dataset, yearsDiffAccessor))
                   .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])
    var yScale = d3.scaleLinear()
                   .domain(d3.extent(dataset, fertilityAccessor))
                   .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

    var Tooltip = svg.append("text")
                    .style("font-size", "10px")
                    .attr("id","tooltip")
                    .style("opacity", 0)
                    .attr("x", 0)
                    .attr("y", 0)
                    .text("")
            
    var points = svg.append("g")
                    .selectAll(".q2-points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "q2-points")
                    .attr("cx", d => xScale(yearsDiffAccessor(d)))
                    .attr("cy", d => yScale(fertilityAccessor(d)))
                    .attr("fill", d => window.continent_color_dict[d["Continent"]])
                    .on("mouseover", function(){
                        update("highlightCountry", d3.select(this)["_groups"][0][0]["__data__"]["Country"])
                        d3.select("#tooltip")
                          .raise()
                          .style("opacity", 1)
                          .attr("x", xScale(d3.select(this)["_groups"][0][0]["__data__"]["YearsDifference"]))
                          .attr("y", yScale(d3.select(this)["_groups"][0][0]["__data__"]["Rate"]))
                          .text(d3.select(this)["_groups"][0][0]["__data__"]["Country"])
                    })
                    .on("mouseout", function(){
                        update("highlightCountry", null) 
                        d3.select("#tooltip")
                          .lower()
                          .style("opacity", 0)
                    })
                    .on("click", function(){
                        var thisData = d3.select(this)["_groups"][0][0]["__data__"]
                        window.selectedCountry = (window.selectedCountry === thisData["Country"] ? null : thisData["Country"])
                        update()
                        d3.select("#tooltip")
                          .raise()
                          .style("opacity", 1)
                          .attr("x", xScale(d3.select(this)["_groups"][0][0]["__data__"]["YearsDifference"]))
                          .attr("y", yScale(d3.select(this)["_groups"][0][0]["__data__"]["Rate"]))
                          .text(d3.select(this)["_groups"][0][0]["__data__"]["Country"])
                    })
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .attr("r", window.circle_r)

    
    var xAxisGen = d3.axisBottom().scale(xScale)
    var xAxis = svg.append("g")
                   .call(xAxisGen)
                   .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
                   .selectAll("text")
                   .attr("y", 0)
                   .attr("x", 9)
                   .attr("dy", ".35em")
                   .attr("transform", "rotate(90)")
                   .style("text-anchor", "start");
               

    var yAxisGen = d3.axisLeft().scale(yScale)
    var yAxis = svg.append("g")
                   .call(yAxisGen)
                   .lower()
                   .style("transform", `translateX(${xScale(0.0)}px)`)

    var differenceLabel = svg.append("g")
                             .append("text")
                             .attr("text-anchor", "middle")
                             .attr("font-size", window.xAxisFontSize)
                             .attr("x", dimensions.width/2)
                             .attr("y", dimensions.height)
                             .text("Years of Increased Schooling for Males")
    var fertLabel = svg.append("g")
                        .append("text") //avg school
                        .attr("text-anchor", "middle")
                        .attr("transform", `rotate(-90, ${dimensions.margin.left - window.yAxisFontSize*2}, ${dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)/2})`)
                        .attr("font-size", window.yAxisFontSize)
                        .attr("x", dimensions.margin.left - window.yAxisFontSize*2)
                        .attr("y", dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)/2)
                        .text("Fertility Rate (Number of Children)")
                    
})
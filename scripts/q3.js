d3.csv("data/q3_data/q3_data.csv").then(function(dataset) {
    var container = document.getElementById("q3-container")
    var svg = d3.select("#q3-viz")

    var dimensions = {
        width: window.width_percentage * container.clientWidth,
        height: 1/4 * window.width_percentage * container.clientWidth,
        margin: {
            top: 10,
            bottom: 10 + window.xAxisFontSize,
            right: 10,
            left: 50 + 2*window.yAxisFontSize
        }
    }

    svg
        .style("width", dimensions.width)
        .style("height", dimensions.height)

    var xAccessor = d => +d["Life Expectancy"]
    var schoolAccessor = d => +d["Years School"]
    var fertAccessor = d => +d["Fertility Rate"]

    var xScale = d3.scaleLinear()
                   .domain(d3.extent(dataset, xAccessor))
                   .range([dimensions.margin.left,dimensions.width-dimensions.margin.right])
    var schoolScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, schoolAccessor))
                    .range([dimensions.height/2, dimensions.margin.top])
    var fertScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, fertAccessor))
                    .range([dimensions.height - dimensions.margin.bottom, dimensions.height/2])

    var lines = svg.append("g")
                    .attr("id", "q3-line-group")
                    .selectAll(".q3-lines")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("class", "q3-lines")
                    .attr("x", d => xScale(xAccessor(d))-.5)
                    .attr("y", d => schoolScale(schoolAccessor(d)))
                    .attr("height", d => fertScale(fertAccessor(d)) - schoolScale(schoolAccessor(d)))
                    .style("fill", d => window.continent_color_dict[d["Continent"]])
                    .attr("stroke", d => window.continent_color_dict[d["Continent"]])
                    .attr("stroke-width", 1)
                    .attr("width", 0)
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .attr("width", 1)

    var school_points = svg.append("g")
                    .attr("id", "school_group")
                    .selectAll(".school_points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "school_points")
                    .attr("cx", d => xScale(xAccessor(d)))
                    .attr("cy", d => schoolScale(schoolAccessor(d)))
                    .attr("r", 0)
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
                    .attr("r", window.circle_r)
    var fert_points = svg.append("g")
                    .attr("id", "fertility_group")
                    .selectAll(".fertility_points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "fertility_points")
                    .attr("cx", d => xScale(xAccessor(d)))
                    .attr("cy", d => fertScale(fertAccessor(d)))
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
                    .attr("r", window.circle_r)

    var xAxis = svg.append("g")
                .call(d3.axisBottom().scale(xScale))
                .style("transform", `translateY(${dimensions.height/2}px)`)
    var schoolAxis = svg.append("g")
                .call(d3.axisLeft().scale(schoolScale))
                .style("transform", `translateX(${dimensions.margin.left}px)`)
    var fertilityAxis = svg.append("g")
                .call(d3.axisLeft().scale(fertScale))
                .style("transform", `translateX(${dimensions.margin.left}px)`)
                .style("transform", `translateY(${dimensions.height/2})`)
    
    var bottomLabel = svg.append("g")
                         .append("text")
                         .attr("text-anchor", "middle")
                         .attr("font-size", window.xAxisFontSize)
                         .attr("x", dimensions.width/2)
                         .attr("y", dimensions.height - window.xAxisFontSize)
                         .text("Average Life Expectancy")
    var schoolLabel = svg.append("g")
                         .append("text") //avg school
                         .attr("text-anchor", "middle")
                         .attr("transform", `rotate(-90, ${dimensions.margin.left - window.yAxisFontSize*5}, ${dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)/4})`)
                         .attr("font-size", window.yAxisFontSize)
                         .attr("x", dimensions.margin.left - window.yAxisFontSize*5)
                         .attr("y", dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)/4)
                         .text("Average Years of School")
    var fertLabel = svg.append("g")
                       .append("text") //avg school
                       .attr("text-anchor", "middle")
                       .attr("transform", `rotate(-90, ${dimensions.margin.left - window.yAxisFontSize*5}, ${dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)*(3/4)})`)
                       .attr("font-size", window.yAxisFontSize)
                       .attr("x", dimensions.margin.left - window.yAxisFontSize*5)
                       .attr("y", dimensions.margin.top + (dimensions.height-dimensions.margin.top-dimensions.margin.bottom)*(3/4))
                       .text("Fertility Rate")
})
d3.csv("data/q3_data/q3_data.csv").then(function(dataset) {
    var container = document.getElementById("q3-container")
    var svg = d3.select("#q3-viz")

    var dimensions = {
        width: window.width_percentage * container.clientWidth,
        height: window.width_percentage * container.clientWidth,
        margin: {
            top: 10,
            bottom: 10 + window.xAxisFontSize,
            right: 10,
            left: 50 + 2*window.yAxisFontSize
        }
    }

    window.q3_dims = dimensions

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

    var Tooltip = svg.append("text")
                    .style("font-size", "10px")
                    .attr("id","tooltip")
                    .style("opacity", 0)
                    .attr("x", 0)
                    .attr("y", 0)
                    .text("")

    var lines = svg.append("g")
                    .attr("id", "q3-line-group")
                    .selectAll(".q3-lines")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("class", "q3-lines")
                    .attr("x", d => xScale(xAccessor(d)))
                    .attr("y", d => schoolScale(schoolAccessor(d)))
                    .attr("height", d => fertScale(fertAccessor(d)) - schoolScale(schoolAccessor(d)))
                    .style("fill", d => window.continent_color_dict[d["Continent"]])
                    .attr("width", 0)
                    .attr("stroke", window.selectStroke)
                    .attr("stroke-width", 0)
                    .style("transform",`translateX(-${window.circle_r/2}px)`)
                    .on("mouseover", function(event){
                        var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                        // Tooltip
                        //   .raise()
                        //   .style("opacity", 1)
                        //   .attr("x", xScale(xAccessor(thisData)) - 20)
                        //   .attr("y", schoolScale(schoolAccessor(thisData)) - 10)
                        //   .text(`${thisData["Country"]}, ${thisData["Period"]}`)
                        update("highlightCountry", thisCountry)
                        displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                    })
                    .on("mouseout", function(){
                        // Tooltip
                        //   .lower()
                        //   .style("opacity", 0)
                        removeToolTip()
                        update("highlightCountry", null) 
                    })
                    .on("mousemove", event => {
                      displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                    })
                    .on("click", function(){
                        var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                        window.selectedCountry = (window.selectedCountry === thisCountry ? null : thisCountry)
                        update()
                    })
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .attr("width", window.circle_r)

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
                    .attr("stroke", window.selectStroke)
                    .attr("stroke-width", 0)
                    .on("mouseover", function(event){
                      var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                      // Tooltip
                      //   .raise()
                      //   .style("opacity", 1)
                      //   .attr("x", xScale(xAccessor(thisData)) - 20)
                      //   .attr("y", schoolScale(schoolAccessor(thisData)) - 10)
                      //   .text(`${thisData["Country"]}, ${thisData["Period"]}`)
                      update("highlightCountry", thisCountry)
                      displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                  })
                  .on("mouseout", function(){
                      // Tooltip
                      //   .lower()
                      //   .style("opacity", 0)
                      removeToolTip()
                      update("highlightCountry", null) 
                  })
                  .on("mousemove", event => {
                    displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                  })
                  .on("click", function(){
                      var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                      window.selectedCountry = (window.selectedCountry === thisCountry ? null : thisCountry)
                      update()
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
                    .attr("stroke", window.selectStroke)
                    .attr("stroke-width", 0)
                    .on("mouseover", function(event){
                      var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                      // Tooltip
                      //   .raise()
                      //   .style("opacity", 1)
                      //   .attr("x", xScale(xAccessor(thisData)) - 20)
                      //   .attr("y", schoolScale(schoolAccessor(thisData)) - 10)
                      //   .text(`${thisData["Country"]}, ${thisData["Period"]}`)
                      update("highlightCountry", thisCountry)
                      displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                  })
                  .on("mouseout", function(){
                      // Tooltip
                      //   .lower()
                      //   .style("opacity", 0)
                      removeToolTip()
                      update("highlightCountry", null) 
                  })
                  .on("mousemove", event => {
                    displayTooltip(event, d3.select(this)["_groups"][0][0]["__data__"]["Period"])
                  })
                  .on("click", function(){
                      var thisCountry = d3.select(this)["_groups"][0][0]["__data__"]["Country"]
                      window.selectedCountry = (window.selectedCountry === thisCountry ? null : thisCountry)
                      update()
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
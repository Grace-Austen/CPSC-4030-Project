d3.csv("data/q3_data/q3_data.csv").then(function(dataset) {
    //style stuff
    var fontSize = 20

    var dimensions = {
        height: 300,
        width: .45 * window.screen.width,
        margin: {
            top: 10,
            bottom: 20 + fontSize,
            right: 10,
            left: 50
        }
    }

    var color = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];    


    var svg = d3.select("#q3-viz")
                .style("width", dimensions.width)
                .style("height", dimensions.height)
                .style("margin-left", "auto")
                .style("margin-right", "auto")
                .style("display", "block")

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
                    .attr("fill", d => color[colorForCountry(d["Continent"])])
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
                    .attr("fill", d => color[colorForCountry(d["Continent"])])
                    .filter(d => d["Period"] === window.selectedPeriod)
                    .attr("r", window.circle_r)

    var xAxisGen = d3.axisBottom().scale(xScale)
    var xAxis = svg.append("g")
                .call(xAxisGen)
                .style("transform", `translateY(${dimensions.height/2}px)`)
    var schoolAxisGen = d3.axisLeft().scale(schoolScale)
    var schoolAxis = svg.append("g")
                .call(schoolAxisGen)
                .style("transform", `translateX(${dimensions.margin.left}px)`)
    var fertilityAxisGen = d3.axisLeft().scale(fertScale)
    var fertilityAxis = svg.append("g")
                .call(fertilityAxisGen)
                .style("transform", `translateX(${dimensions.margin.left}px)`)
                .style("transform", `translateY(${dimensions.height/2})`)
    
    var bottomLabel = svg.append("g")
                         .append("text")
                         .attr("text-anchor", "middle")
                         .attr("font-size", fontSize)
                         .attr("x", dimensions.width/2)
                         .attr("y", dimensions.height - fontSize)
                         .text("Average Life Expectancy")
    var schoolLabel = svg.append("g")
                         .append("text") //avg school
                         .attr("text-anchor", "middle")
                         .attr("transform", `rotate(-90, ${dimensions.margin.left - fontSize*1.5}, ${dimensions.margin.top+(dimensions.height-dimensions.margin.bottom)/4})`)
                         .attr("font-size", fontSize/2)
                         .attr("x", dimensions.margin.left - fontSize*1.5)
                         .attr("y", dimensions.margin.top+(dimensions.height-dimensions.margin.bottom)/4)
                         .text("Average Years of School")
    var fertLabel = svg.append("g")
                       .append("text") //avg school
                       .attr("text-anchor", "middle")
                       .attr("transform", `rotate(-90, ${dimensions.margin.left - fontSize*1.5}, ${dimensions.margin.top+3*(dimensions.height-dimensions.margin.bottom)/4})`)
                       .attr("font-size", fontSize/2)
                       .attr("x", dimensions.margin.left - fontSize*1.5)
                       .attr("y", dimensions.margin.top+3*(dimensions.height-dimensions.margin.bottom)/4)
                       .text("Fertility Rate")

})


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
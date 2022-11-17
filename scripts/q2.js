d3.csv("data/q2_data/q2.csv").then((dataset) => {
    var container = document.getElementById("q2-container")
    var dimensions = {
        height: 250,
        width: .95 * container.clientWidth,
        margin:{
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    }

    console.log(dataset);

    var svg = d3.select("#q2-viz")
                .style("width", dimensions.width)
                .style("height", dimensions.height)

    var xScale = d3.scaleLinear()
                   .domain(d3.extent(dataset, d => +d["YearsDifference"]))
                   .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])

    var yScale = d3.scaleLinear()
                   .domain(d3.extent(dataset, d => +d["Rate"]))
                   .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

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

    var color = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];    
            
    var points = svg.append("g")
                    .selectAll(".q2-points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .style("opacity", d => d["Period"] === window.selectedPeriod ? 1 : 0)
                    .attr("class", "q2-points")
                    .attr("cx", d => xScale(+d["YearsDifference"]))
                    .attr("cy", d => yScale(+d["Rate"]))
                    .attr("r", window.circle_r)
                    .attr("fill", d => color[colorForCountry(d["Continent"])])
    
    var xAxisGen = d3.axisBottom().scale(xScale)

    var xAxis = svg.append("g")
                   .call(xAxisGen)
                   .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)

    var yAxisGen = d3.axisLeft().scale(yScale)

    var yAxis = svg.append("g")
                   .call(yAxisGen)
                   .style("transform", `translateX(${dimensions.margin.left}px)`)

    var differenceLabel = svg.append("g")
                             .append("text")
                             .attr("text-anchor", "middle")
                             .attr("font-size", 20)
                             .attr("x", dimensions.width/2)
                             .attr("y", dimensions.height - 20)
                             .text("Average Years of Difference in Schooling Between Genders")
    var fertLabel = svg.append("g")
                        .append("text") //avg school
                        .attr("text-anchor", "middle")
                        .attr("transform", `rotate(-90, ${dimensions.margin.left - 30}, ${dimensions.margin.top+(dimensions.height-dimensions.margin.bottom)/2})`)
                        .attr("font-size", "10")
                        .attr("x", dimensions.margin.left - 30)
                        .attr("y", dimensions.margin.top+(dimensions.height-dimensions.margin.bottom)/2)
                        .text("Fertility Rate (Number of Children)")
                    
})
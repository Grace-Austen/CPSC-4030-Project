window.dataset.then((dataset) => {

    var dimensions = {
        height: 300,
        width: .45 * window.screen.width,
        margin:{
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    }

    var svg = d3.select("#q2-viz")
        .style("width", dimensions.width)
        .style("height", dimensions.height)

    var xScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, d => +d["YearsDifference"]))
                    .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(dataset, d => +d["FertRate"]))
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
                    .attr("cy", d => yScale(+d["FertRate"]))
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
                    
})
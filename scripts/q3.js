d3.csv("data/q3_data/q3_data.csv").then(function(dataset) {
    var dimensions = {
        height: 300,
        width: .5 * window.screen.width,
        margin: {
            top: 10,
            bottom: 10,
            right: 10,
            left: 50
        }
    }

    var point_size = 3

    var svg = d3.select("#q3")
                .style("width", dimensions.width)
                .style("height", dimensions.height)
                .style("margin-left", "auto")
                .style("margin-right", "auto")
                .style("display", "block")
    console.log(dataset)

    var xAccessor = d => +d["Life Expectancy"]
    var schoolAccessor = d => +d["Years School"]
    var fertAccessor = d => +d["Fertility Rate"]

    console.log(d3.extent(dataset, fertAccessor))

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
                    .selectAll(".school_points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "school_points")
                    .attr("cx", d => xScale(xAccessor(d)))
                    .attr("cy", d => schoolScale(schoolAccessor(d)))
                    .attr("r", point_size)
                    .attr("fill", "black")
    var fert_points = svg.append("g")
                    .selectAll(".fertility_points")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "fertility_points")
                    .attr("cx", d => xScale(xAccessor(d)))
                    .attr("cy", d => fertScale(fertAccessor(d)))
                    .attr("r", point_size)
                    .attr("fill", "black")

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
})

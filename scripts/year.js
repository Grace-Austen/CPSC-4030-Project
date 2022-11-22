d3.csv("data/q1_data/q1_data.csv").then(function(dataset){
    var svg = d3.select("#year")
    var container = document.getElementById("year-container")

    var barFill = "darkgrey"

    var width_percentage = 0.95
    var dims = {
        width: width_percentage * container.clientWidth,
        height: .4 * width_percentage * container.clientWidth,
        margin: {
            top: 10,
            bottom: 30 + window.xAxisFontSize,
            right: 10,
            left: 70 + 2*window.yAxisFontSize,
            barHeight: (.6 * width_percentage * container.clientWidth) / (15*4)
        }
    };

    //Set the width and height for the svg
    svg
        .style("width", dims.width)
        .style("height", dims.height);

    var data = d3.group(dataset, d => d["Period"])
    var yearsDict = new Map()
    data.forEach((list, year) => {
        yearsDict.set(year, d3.rollup(list, v => d3.mean(v, d => d["SchoolYears"])))
    })
    var averageEducation = [];
    yearsDict.forEach((value, year) => {
        let newData = {
            "year": year,
            "school": value
        };
        averageEducation.push(newData)
    })

    var maxEd = 0
    averageEducation.forEach(dict => {
        if (dict["school"] > maxEd)
            maxEd = dict["school"]
    })
    
    var yScale = d3.scaleBand()
                   .domain(yearsDict.keys())
                   .range([dims.margin.top, dims.height - dims.margin.bottom])
    var xScale = d3.scaleLinear()
                   .domain([0, maxEd])
                   .range([0, dims.width - dims.margin.right - dims.margin.left])

    var bars = svg.append("g")
        .selectAll("rect")
        .data(averageEducation)
        .enter()
        .append("rect")
        .attr("class", "year_bar")
        .on("click", function(){
            stopPlay()
            window.selectedPeriod = d3.select(this)["_groups"][0][0]["__data__"]["year"]
            selectPeriod()
        })
        .on("mouseover", function(){
            d3.select(this)
              .attr("stroke-width", window.selectStroke)
            d3.selectAll(".year_bar")
              .filter(d => d["year"] === window.selectedPeriod)
              .attr("stroke-opacity", .5)
        })
        .on("mouseout", function(){
            d3.selectAll(".year_bar")
              .attr("stroke-width", 0)
              .attr("stroke-opacity", 1)
              .filter(d => d["year"] === window.selectedPeriod)
              .attr("stroke-width", window.selectStroke)
        })
        .attr("x", dims.margin.left)
        .attr("y", d => yScale(d["year"]))
        .attr("width", d => xScale(+d["school"]))
        .attr("height", yScale.bandwidth() - dims.margin.barHeight)
        .attr("fill", barFill)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .filter(d => d["year"] === window.selectedPeriod)
        .attr("stroke-width", window.selectStroke)
        .attr("id", "chosen_year")

        //axis
    svg.append("g").call(d3.axisBottom().scale(xScale))
       .style("transform", `translateY(${dims.height - dims.margin.bottom}px) translateX(${dims.margin.left}px)`)
    svg.append("g").call(d3.axisLeft().scale(yScale))
       .style("transform", `translateX(${dims.margin.left}px)`);

    var schoolLabel = svg.append("g")
                         .append("text")
                         .attr("text-anchor", "middle")
                         .attr("font-size", window.xAxisFontSize)
                         .attr("x", dims.width/2)
                         .attr("y", dims.height - dims.margin.bottom + 2.5*window.xAxisFontSize)
                         .text("Global Average Years of Schooling")

    var periodLabel = svg.append("g")
                         .append("text")
                         .attr("text-anchor", "middle")
                         .attr("transform", `rotate(-90, ${dims.margin.left - 7.5*window.yAxisFontSize}, ${dims.margin.top + (dims.height-dims.margin.top-dims.margin.bottom)/2})`)
                         .attr("font-size", window.yAxisFontSize)
                         .attr("x", dims.margin.left - 7.5*window.yAxisFontSize)
                         .attr("y", dims.margin.top + (dims.height-dims.margin.top-dims.margin.bottom)/2)
                         .text("Time Period")
})
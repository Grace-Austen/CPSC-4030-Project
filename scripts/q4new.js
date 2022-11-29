d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select svg and overall container
    var svg = d3.select("#q4-viz");
    var container = document.getElementById("q4-container");

    //Setup dimensions
    var dims = {
        width: 500,
        height: 250,
        margin: {
            top: 10,
            bottom: 80,
            right: 25,
            left: 50
        }
    };

    //Set width and height to svg
    svg.style("width", dims.width);
    svg.style("height", dims.height);

    var accessors = ["SchoolYears", "LifeYears", "Fertility", "MigrNet", "YearsDifference"];

    //Setup x scale, which is all the attributes
    var xScale = d3.scaleBand()
                    .domain(["SchoolYears", "LifeYears", "Fertility", "MigrNet", "YearsDifference"])
                    .range([dims.margin.left, dims.width - dims.margin.right])
                    .padding([0.2]);

    //Array of y scales, or bars
    var yScales = [];

    //Create each y scale
    for (let accessor of accessors) {
        yScales.push(d3.scaleLinear()
                        .domain(d3.extent(dataset, d => d[accessor]))
                        .range([dims.height - dims.margin.bottom, dims.margin.top]));
    }
    
    //Add x axis
    svg.append("g").call(d3.axisBottom().scale(xScale))
                    .style("transform", `translateY(${yScales[0](0)}px)`)
                    .selectAll("text")
                    .attr("transform", `rotate(-90)`)
                    .attr("dx", "-40");

    var counter = 0;

    //Add y axes
    for (let y of yScales) {
        svg.append("g")
            .call(d3.axisLeft().scale(y).ticks(5))
            .style("transform", `translateX(${xScale(accessors[counter]) + (xScale.bandwidth() / 2)}px)`)
            .selectAll("text")
            .attr("transform", `rotate(-90)`)
            .attr("dy", "10");

        counter += 1;
    }

    //Iterate over every country
    for (let item of dataset) {
        var counter2 = 0;
        
        //Plot every attribute of every country
        for (let accessor of accessors) {
            // svg.append("path")
            //     .datum(item)
            //     .attr("fill", "none")
            //     .attr("stroke", "black")
            //     .attr("stroke-width", 1.5)
            //     .attr("d", d3.line()
            //                     .x(xScale(accessor) + (xScale.bandwidth() / 2))
            //                     .y(yScales[counter2](item[accessor])));

            var xval = xScale(accessor) + (xScale.bandwidth() / 2);
            var yval = yScales[counter2](item[accessor]);

            svg.append("g")
                .selectAll(".q4-point")
                .data(item)
                .enter()
                .append("circle")
                .attr("class", "q4-point")
                .attr("cx", xval)
                .attr("cy", yval)
                .attr("fill", window.continent_color_dict[item["Continent"]])
                .attr("r", 1);
            
            console.log(xval)
            console.log(yval)
            ++counter2;
        }
    }

    //Flip
    svg.attr("transform", `rotate(90)`);
});
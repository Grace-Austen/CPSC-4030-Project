d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select svg and overall container
    var svg = d3.select("#q4-viz");
    var container = document.getElementById("q4-container");

    //Setup dimensions
    var dims = {
        width: 500,
        height: 300,
        margin: {
            top: 100,
            bottom: 100,
            right: 100,
            left: 100
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
                    .padding(0.1);

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
                    .style("transform", `translateY(${yScales[0](0)}px)`);

    var space = 0;
    var counter = 0;

    //Add y axes
    for (let y of yScales) {
        svg.append("g")
            .call(d3.axisLeft().scale(y).ticks(5))
            .style("transform", `translateX(${xScale(accessors[counter]) + (xScale.bandwidth() / 2)}px)`);

        counter += 1;
    }

    for (let item of dataset) {
        var itemSmall = [item["SchoolYears"], item["LifeYears"], item["Fertility"], item["MigrNet"], item["YearsDifference"]];

        svg.append("g")
            .selectAll(".q4-point")
            .data(itemSmall)
            .enter()
            .append("circle")
            .attr("class", "q4-point")
            .attr("cx", (d, i) => xScale(accessors[i]) + (xScale.bandwidth() / 2))
            .attr("cy", (d, i) => yScales[i](d))
            .attr("fill", d => window.continent_color_dict[item["Continent"]])
            .attr("r", 1);
    }

    svg.attr("transform", `rotate(90)`);
});
d3.csv("data/q4_data/q4.csv").then((dataset) => {
    //Select svg and overall container
    var svg = d3.select("#q4-viz");
    var container = document.getElementById("q4-container");

    //Setup dimensions
    var dims = {
        width: container.clientHeight,
        height: window.width_percentage * container.clientWidth,
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

    //Function to generate line from coords
    function lineMaker(d) {
        let cords = [];
        let counter = 0;

        for (let accessor of accessors) {
            var x = xScale(accessor) + (xScale.bandwidth() / 2);
            var y = yScales[counter](d[accessor]);

            cords.push([x, y]);
            ++counter;
        }

        return(d3.line().curve(d3.curveNatural)(cords));
    }

    //Add all lines for each element of dataset
    svg.append("g")
        .selectAll(".q4-lines")
        .data(dataset)
        .enter()
        .append("path")
        .attr("class", "q4-lines")
        .attr("d", d => lineMaker(d))
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("stroke", d => window.continent_color_dict[d["Continent"]]);

    //Flip
    svg.attr("transform", `rotate(90)`);
});
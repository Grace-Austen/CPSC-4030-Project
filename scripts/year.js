window.selectedPeriod = "2015-2020"
d3.csv("data/combined_data/combined.csv").then(function(dataset){
    var data = d3.group(dataset, d => d["Period"])
    var yearsDict = new Map()
    data.forEach((list, year) => {
        yearsDict.set(year, d3.rollup(list, v => d3.mean(v, d => d["SchoolYears"])))
    })

    var svg = d3.select("#year")

    var dims = {
        width: .9 * window.screen.width,
        height: 200,
        margin: {
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    };

    //Set the width and height for the svg
    svg.style("width", dims.width);
    svg.style("height", dims.height);

    var xScale = d3.scaleBand()
                   .domain(yearsDict.keys())
                   .range([dims.margin.left, dims.width - dims.margin.right]);

    var averageEducation = [];
    yearsDict.forEach((value, year) => {
        let newData = {
            "year": year,
            "school": value
        };
        averageEducation.push(newData)
    })
    console.log(averageEducation)
    var yScale = d3.scaleLinear()
        .domain(d3.extent(averageEducation, d => +d["school"]))
        .range([dims.height - dims.margin.bottom, dims.margin.top]);

    svg.append("g").call(d3.axisBottom().scale(xScale))
        .style("transform", `translateY(${dims.height - dims.margin.bottom}px)`);
    svg.append("g").call(d3.axisLeft().scale(yScale))
        .style("transform", `translateX(${dims.margin.left}px)`);

    var bars = svg.append("g")
        .selectAll("rect")
        .data(averageEducation)
        .enter()
        .append("rect")
        .on("click", function(){
            window.selectedPeriod = d3.select(this)["_groups"][0][0]["__data__"]["year"]
            selectPeriod()
        })
        .attr("x", d => xScale(d["year"]))
        .attr("y", d => yScale(+d["school"]))
        .attr("height", d => dims.height - dims.margin.bottom - yScale(+d["school"]))
        .attr("width", xScale.bandwidth() - 10)
})
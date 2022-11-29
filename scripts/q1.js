d3.csv("data/q1_data/q1_data.csv").then((dataset) => {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#q1-viz")
        var container = document.getElementById("q1-container")

        //drawing style
        var colormap = d3.interpolateGreens
        var earthColor = "lightblue"
        var lineColor = "grey"
        var graticuleStroke = 1
        var countryStroke = .75
        var countryStrokeColor = "lightgrey"
        var fontSize = .6 * window.width_percentage * container.clientWidth * .05
        //svg dimensions
        var dimensions = {
            width: window.width_percentage * container.clientWidth,
            height: .6 * window.width_percentage * container.clientWidth + 1.5*window.xAxisFontSize,
            margin: {
                top: 10,
                bottom: 50 + window.xAxisFontSize,
                right: 10,
                left: 10,
                legend: .5 * window.width_percentage * container.clientWidth 
            }
        }
        console.log(dimensions.width)

        //set svg width and height
        svg.attr("height", dimensions.height)
           .attr("width", dimensions.width)

        var data = d3.group(dataset, d => d["Period"])
        var yearsDict = new Map()
        data.forEach((list, year) => {
            var innerDict = new Map()
            for (var country of list) {
                innerDict.set(country["Country"], country)
            }
            yearsDict.set(year, innerDict)
        })

        window.q1dict = yearsDict

        // //colorscale and education accessor
        var educationAccessor = function(dict) {return dict.get(window.selectedPeriod)}
        var countryAccessor = d => d["properties"].ADMIN
        var colorScale = d3.scaleSequential(colormap)
                            .domain(d3.extent(dataset, d => d["SchoolYears"]))

        window.q1colorscale = colorScale

        //map drawing stuff
        var projection = d3.geoEqualEarth()
                           .fitWidth(dimensions.width, {type: "Sphere"})
        var pathGenerator = d3.geoPath(projection)

        //earth background
        var earth = svg.append("path")
                       .attr("id", "map-background")
                       .attr("d", pathGenerator({type: "Sphere"}))
                       .attr("fill", earthColor)
        //long/lat lines
        var graticule = svg.append("path")
                           .attr("id", "map-graticule")
                           .attr("d", pathGenerator(d3.geoGraticule10()))
                           .attr("stroke", countryStrokeColor)
                           .attr("stroke-width", graticuleStroke)
                           .attr("fill", "none")

        //draw in countries
        var countries = svg.append("g")
                           .selectAll(".country")
                           .data(mapdata.features)
                           .enter()
                           .append("path")
                           .attr("class", "country")
                           .attr("d", d => pathGenerator(d))
                           .attr("stroke", lineColor)
                           .attr("stroke-width", countryStroke)
                           .on("mouseover", function(event){
                                update("highlightCountry", countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                            })
                            .on("mouseout", function(event){
                                update("highlightCountry", null)
                                displayTooltip(event)
                           })
                           .on("mousemove", event => displayTooltip(event))
                           .on("click", function(){
                                var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                window.selectedCountry = window.selectedCountry === thisCountry ? null : thisCountry
                                update()
                           })

        //color in countries
        countries.attr("fill", d => {
                            var countryInfo =  educationAccessor(yearsDict).get(countryAccessor(d));
                            if(countryInfo !== undefined) {
                                return colorScale(countryInfo["SchoolYears"])
                            } else {
                                return "lightgrey"
                            }
                        })
        
        //color legend
        var legend = d3.legendColor()
                       .shapeWidth((dimensions.width-12)/5)
                       .orient("horizontal")
                       .scale(colorScale)
        svg.append("g")
           .style("transform", `translateY(${dimensions.margin.legend}px)`)
           .call(legend)
        var legendSwatches = d3.selectAll(".swatch")
        legendSwatches.attr("height", fontSize)
        var legendLabels = d3.selectAll(".label")
                            .attr("font-size", fontSize)
        legendLabels = document.getElementsByClassName("label")
        for (var item of legendLabels){
            var ytrans = item.attributes.transform.value.split("(")[1].split(",")[1].split(")")[0] - (fontSize)
            var newtrans = item.attributes.transform.value.split(",")[0] + "," + 2*fontSize + ")"
            item.attributes.transform.value = newtrans
        }

        //country selected
        var legendLabel = svg.append("text")
                                    .attr("id", "q1-legend-label")
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", window.xAxisFontSize)
                                    .attr("x", (dimensions.width/2))
                                    .attr("y", dimensions.height - window.xAxisFontSize)
                                    .text("Mean Years of Schooling")

        // //country selected
        // var countrySelectedText = svg.append("text")
        //                             .attr("id", "countrySelectedText")
        //                             .attr("text-anchor", "middle")
        //                             .attr("font-size", window.xAxisFontSize)
        //                             .attr("x", (dimensions.width/2))
        //                             .attr("y", dimensions.height - window.xAxisFontSize)
        //                             .text("Country selected: none")

    })
})
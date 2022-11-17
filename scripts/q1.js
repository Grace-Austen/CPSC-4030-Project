d3.csv("data/q1_data/q1_data.csv").then((dataset) => {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#q1-viz")
        var container = document.getElementById("q1-viz-table")

        //drawing style
        var colormap = d3.interpolateGreens
        var earthColor = "darkblue"
        var lineColor = "grey"
        var graticuleStroke = 1
        var countryStroke = .75
        var countrySelectLineColor = "dimgrey"
        var countryFontSize = 30

        var width_percentage = 0.5

        //svg dimensions
        var dimensions = {
            width: width_percentage * container.clientWidth,
            height: .6 * width_percentage * container.clientWidth + 15 + countryFontSize,
            margin: {
                top: 10,
                bottom: 50 + countryFontSize,
                right: 10,
                left: 10,
                legend: .5 * width_percentage * container.clientWidth 
            }
        }

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
        console.log(yearsDict)

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
                           .attr("stroke", lineColor)
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
                           .attr("stroke", d => {
                                            var countryInfo = educationAccessor(yearsDict).get(countryAccessor(d))
                                            if (countryInfo !== undefined) {
                                                return window.continentColors[window.colorForCountry(countryInfo["Continent"])]
                                            } else {
                                                return countryStroke
                                            }
                            })
                           .attr("stroke-width", countryStroke)
                           .on("mouseover", function(){
                                //window.selectedCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                // d3.select(this)
                                //   .attr("stroke-width", window.selectStroke)
                                var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                countrySelectedText.text("Country selected: " + thisCountry)
                                selectCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                            })
                            .on("mouseout", function(){
                                // window.selectedCountry = null
                                // d3.select(this)
                                //   .attr("stroke-width", countryStroke)
                                countrySelectedText.text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)
                                deselectCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                           })
                           .on("click", function(){
                                var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                window.selectedCountry = window.selectedCountry === thisCountry ? null : thisCountry
                                countrySelectedText.text(`Country selected: ${window.selectedCountry === null ? "none" : window.selectedCountry}`)
                                setCountry()
                           })

        //color in countries
        countries.attr("fill", d => {
                            var countryInfo =  educationAccessor(yearsDict).get(countryAccessor(d));
                            if(countryInfo !== undefined) {
                                return colorScale(countryInfo["SchoolYears"])
                            } else {
                                return "black"
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

        //country selected
        var countrySelectedText = svg.append("text")
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", countryFontSize)
                                    .attr("x", (dimensions.width/2))
                                    .attr("y", dimensions.height - countryFontSize)
                                    .text("Country selected: none")

    })
})
d3.csv("data/q1_data/q1_data.csv").then((dataset) => {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#newMap")
        var container = document.getElementById("newMapContainer")

        //drawing style
        var width_percentage = 1
        var colormap = d3.interpolateGreens
        var earthColor = "blue"
        var lineColor = "grey"
        var graticuleStroke = 1
        var countryStroke = .75
        var countryFontSize = .6 * width_percentage * container.clientWidth * .05


        //svg dimensions
        var dimensions = {
            width: width_percentage * container.clientWidth,
            height: .6 * width_percentage * container.clientWidth + 2*countryFontSize,
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
        // var earth = svg.append("path")
        //                .attr("id", "map-background")
        //                .attr("d", pathGenerator({type: "Sphere"}))
        //                .attr("fill", earthColor)
        // //long/lat lines
        // var graticule = svg.append("path")
        //                    .attr("id", "map-graticule")
        //                    .attr("d", pathGenerator(d3.geoGraticule10()))
        //                    .attr("stroke", lineColor)
        //                    .attr("stroke-width", graticuleStroke)
        //                    .attr("fill", "none")

        //draw in countries
        var countries = svg.append("g")
                           .selectAll(".continent_countries")
                           .data(mapdata.features)
                           .enter()
                           .filter(d => countryAccessor(d) !== "Antarctica")
                           .append("path")
                           .attr("class", "continent_countries")
                           .attr("d", d => pathGenerator(d))
                           .attr("stroke", "none")
                           .attr("stroke-width", countryStroke)
                        //    .on("mouseover", function(){
                        //         var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                        //         selectCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                        //     })
                        //     .on("mouseout", function(){
                        //         deselectCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                        //    })
                        //    .on("click", function(){
                        //         var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                        //         window.selectedCountry = window.selectedCountry === thisCountry ? null : thisCountry
                        //         setCountry()
                        //    })

        //color in countries
        countries.attr("fill", d => {
                                var currentContinent = d["properties"].CONTINENT
                                if(currentContinent == "North America"){
                                    currentContinent = "North_America"
                                }
                                else if(currentContinent == "South America"){
                                    currentContinent = "Latin_America_and_the_Carribean"
                                }
                                return window.continentColors[window.colorForCountry(currentContinent)]
                        })
    })
})
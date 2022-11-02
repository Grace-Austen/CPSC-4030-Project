d3.csv("src/data/q3_data.csv").then(function(dataset) {
    var dimensions = {
        height: 750,
        width: .8 * window.screen.width
    }

    var svg = d3.select("#q3")
                .style("width", dimensions.width)
                .style("height", dimensions.height)
                .style("margin-left", "auto")
                .style("margin-right", "auto")
                .style("display", "block")
    console.log(dataset)

    xAccessor = d => d[3]

    var xSvale = d3.scaleLinear()
                   .domain(d3.extent(dataset, xAccessor))
                   .domain()
    
})

/*


        var xScale = d3.scaleBand()
                       .domain(d3.map(dataset, d => {
                        
                       }))
    }
)*/
(function () {
    var width = 975,
        height = 615;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var defs = svg.append("defs");

    defs.append("pattern")
        .attr("id", "jon-snow")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", "snow.jpg");
    
    var radiusScale = d3.scaleSqrt().domain([1, 300]).range([10, 80])

    var forceX = d3.forceX(function(d) {
        if(d.decade === 'data') {
            return 150
        } 
        
        else if (d.decade=== 'visualization') {
            return 200
        }

        else if (d.decade=== 'machinelearning') {
            return 400
        }

        else if (d.decade=== 'database') {
            return 700
        }
        
        else if (d.decade=== 'webapps') {
            return 555
        }
        
        else {
            return 850
        }
    }).strength(.01)

    var forceY = d3.forceY(function(d) {
        if(d.decade === 'data') {
            return 125
        } 
        
        else if (d.decade=== 'visualization') {
            return 375
        }

        else if (d.decade=== 'machinelearning') {
            return 175
        }

        else if (d.decade=== 'database') {
            return 140
        }
        
        else if (d.decade=== 'webapps') {
            return 420
        }
        
        else {
            return 305
        }
    }).strength(.01)

    var forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.sales) + 2;
    })

    var simulation = d3.forceSimulation()
        .force("x", "forceX")
        .force("y", "forceY")
        .force("collide", forceCollide)
    d3.queue()
        .defer(d3.csv, "sales.csv")
        .await(ready)

    function ready(error, datapoints) {
        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "artist-pattern")
            .attr("id", function (d) {
                return d.name.toLowerCase().replace(/ /g, "-")
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function (d) {
                return d.image_path
            });
        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusScale(d.sales);
            })
            .attr("fill", function (d) {
                return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
            })
            .on('click', function (d) {
                console.log(d)
            })

        d3.select("#decade").on('click', function () {
            simulation
                .force("x", d3.forceX(width / 2).strength(.01))
                .force("y", d3.forceY(height / 2).strength(.01))
                .alphaTarget(0.5)
                .restart()
        })
        d3.select("#combine").on('click', function () {
            simulation
                .force("x", forceX)
                .force("y", forceY)
                .alphaTarget(0.5)
                .restart()
        })

        jQuery(function(){
            jQuery('#decade').click();
         });
        

        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }
    }
})();
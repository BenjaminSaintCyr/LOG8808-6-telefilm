export function multiLineChart(data, width, height) {
    let xValues = data.map(elem => {
        return elem.periode
    })
    let yValues = data.map(elem => {
        return elem.valeurf
    })
    let possibleXValues = xValues.filter(function(item, pos) {
        return xValues.indexOf(item) == pos
    })

    let groupedData = d3.nest()
        .key(function(d) { return d.langue })
        .entries(data)

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60}

    width = width - margin.left - margin.right
    height = height - margin.top - margin.bottom

    // append the svg object to the body of the page
    let svg = d3.select("#viz-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

    // console.log(possibleXValues)

    let xScale = d3.scalePoint().domain(possibleXValues).range([0, width])
    let yScale = d3.scaleLinear().domain([0, Math.max(...yValues)]).range([height, 0])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))

    svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(yScale).ticks(10))

    let keys = groupedData.map(function(d){ return d.key })

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        
    svg.selectAll(".line")
        .data(groupedData)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d) {
            return d3.line()
            .x(function(d) { return xScale(d.periode) })
            .y(function(d) { return yScale(+d.valeurf) })
            (d.values)
        })

    // Légende
    const legendX = width - 100
    const legendY = 50

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", legendX)
        .attr("cy", function(d,i){ return legendY + i*25})
        .attr("r", 7)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", function(d,i){ return legendY + i*25 + 5})
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}

export function setCanvasSize(width, height) {
    d3.select('#map').select('svg')
        .attr('width', width)
        .attr('height', height)
}

export function generateMapG (width, height) {
  return d3.select('.graph')
    .select('svg')
    .append('g')
    .attr('id', 'map-g')
    .attr('width', width)
    .attr('height', height)
}

export function generateMarkerG(width, height) {
 return d3.select('.graph')
    .select('svg')
    .append('g')
    .attr('id', 'marker-g')
    .attr('width', width)
    .attr('height', height)
}

export function mapBackground (data, path) {
  d3.select('#map-g')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', '#c2c1b4')
    .style('stroke', 'white')
}

export function getProjection () {
  return d3.geoMercator()
    .center([-106.346771, 60.130366])
    .scale(700)
}

export function getPath (projection) {
  return d3.geoPath()
    .projection(projection)
}

export function mapMarkers(data) {
    d3.select('#marker-g')
        .selectAll('circle')
        .data(data.items)
        .enter()
        .append('circle')
        .style('fill', () => { return 'black' })
        .style('stroke', () => { return 'red' })
        .attr('cx', (d) => { return d.x })
        .attr('cy', (d) => { return d.y })
        .attr('r', 2)
}
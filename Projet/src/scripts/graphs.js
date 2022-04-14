export function multiLineChart(data, width, height, category) {
    d3.select("#viz-container").selectAll('*').remove()

    let xValues = data.map(elem => {
        return elem.periode
    })
    let yValues = data.map(elem => {
        return elem.valeurf
    })
    let categoryValues = data.map(elem => {
        return elem[category]
    })
    let possibleXValues = xValues.filter(function(item, pos) {
        return xValues.indexOf(item) == pos
    })
    let possibleCategoryValues = categoryValues.filter(function(item, pos) {
        return categoryValues.indexOf(item) == pos
    })

    console.log(possibleCategoryValues)

    let groupedData = d3.nest()
        .key(function(d) { return d.periode })
        .entries(data)

    console.log(groupedData)

    let groups = groupedData.map(function(d){ return d.key })

    let stackedData = d3.stack()
        .keys(possibleCategoryValues)
        .value(function(d, key){
            return d.values[possibleCategoryValues.indexOf(key)].valeurf
        })
        (groupedData)

    console.log(stackedData)

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

    let xScale = d3.scalePoint().domain(possibleXValues).range([0, width - 300])

    let topValues = stackedData[stackedData.length - 1].map(elem => elem[1])
    let maxY = Math.max(...topValues)
    let yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))

    svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(yScale).ticks(10))

    var color = d3.scaleOrdinal()
        .domain(possibleCategoryValues)
        .range(['#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .style("fill", function(d) { 
              return color(d.key)
            })
          .attr("d", d3.area()
            .x(function(d, i) {
                return xScale(d.data.key); 
            })
            .y0(function(d) { return yScale(d[0]); })
            .y1(function(d) { return yScale(d[1]); })
        )

    // Légende
    const legendX = width - 275
    const legendY = 50 + possibleCategoryValues.length * 20

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
        .data(possibleCategoryValues)
        .enter()
        .append("circle")
        .attr("cx", legendX)
        .attr("cy", function(d,i){ return legendY - i*20})
        .attr("r", 7)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(possibleCategoryValues)
        .enter()
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", function(d,i){ return legendY - i*20 + 5})
        .text(function(d){ 
            return d == '0' ? 'Festival' : d 
        })
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

export function mapBackground (data, path, showMapCentroids, circlesData) {
  d3.select('#map-g')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', '#c2c1b4')
    .style('stroke', 'white')
    
    // Triggers provinces pie charts appearance
    data.features.forEach((d) => {
        showMapCentroids(d, path, circlesData)
    })

}

export function getProjection () {
  return d3.geoMercator()
    .center([-106.346771, 62.130366])
    .scale(600)
}

export function getPath (projection) {
  return d3.geoPath()
    .projection(projection)
}

export function mapMarkers(data, circlesData) {
    const sizeScale = setCitRadiusScale()

    circlesData.provinces.forEach(prov => {
        prov.villes.forEach((cit, key) => {
            let city = data.items.find(obj => obj.name.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === key)

            if (city !== undefined) {
                let pie = d3.pie().value(dat => dat)
                const totalMovies = cit.nbFrancais + cit.nbAnglais

                d3.select('#marker-g')
                    .selectAll('idkWhyButYouNeedMe')
                    .data(pie([cit.nbFrancais, cit.nbAnglais]))
                    .enter()
                    .append('path')
                    .attr('d', d3.arc().innerRadius(0).outerRadius(sizeScale(totalMovies)))
                    .attr('fill', (d) => d.data === cit.nbFrancais ? "blue" : "red")
                    .attr('stroke', 'black')
                    .attr('transform', `translate(${city.x}, ${city.y})`)
                    .attr('class', 'provincePieChart')
                }
            })
    })
}

export function showMapCentroids (d, path, circlesData) {
    let pie = d3.pie().value(dat => dat)
    const province = circlesData.provinces.get(d.properties.name)
    const [x, y] = path.centroid(d)
    const adjustedY = 
        d.properties.name === "Territoires Nord-Ouest" ? y + 125 :
        d.properties.name === "Nunavut" ? y + 300 :
        y
    
    const sizeScale = setProvRadiusScale()
    const totalMovies = province.nbFrancaisTot + province.nbAnglaisTot
    
    d3.select('#map-g')
        .selectAll('idkWhyButYouNeedMe')
        .data(pie([province.nbFrancaisTot, province.nbAnglaisTot]))
        .enter()
        .append('path')
        .attr('d', d3.arc().innerRadius(0).outerRadius(sizeScale(totalMovies)))
        .attr('fill', (d) => d.data === province.nbFrancaisTot ? "blue" : "red")
        .attr('stroke', 'black')
        .attr('transform', `translate(${x}, ${adjustedY})`)
        .attr('class', 'provincePieChart')
}

export function setProvRadiusScale() {
    return d3.scaleSqrt().domain([0, 4436]).range([10, 35])
}

export function setCitRadiusScale() {
    return d3.scaleSqrt().domain([0, 3534]).range([2, 8])
}
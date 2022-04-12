export function drawMap(width, height, data, path) {
    // Set up the SVG element that contains the map
    // var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    // var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    console.log('drawing map')
    
    var svg = d3.select('main')
        .append('div').attr('id', 'map-container')
        .append('svg')
        .attr("width", width + 100)
        .attr("height", height)
        .append('g')
        .attr('class', 'map')
    
    // Generate the canada's coordinates path
    d3.select('#map-g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', path)
}

/*export function generateMarkerG(width, height) {
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
}*/

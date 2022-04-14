import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'
import * as map from './scripts/map.js'

(function (d3) {
  // Draw chart
  d3.csv('./telefilm.csv').then(function(data) {
    console.log(data)
    let chartData = preprocess.getAreaChartData(data, 'genre')
    graphs.multiLineChart(chartData, 1000, 500, 'genre')

    document.getElementById("langueButton").addEventListener("click", function() {
      let chartData = preprocess.getAreaChartData(data, 'langue')
      graphs.multiLineChart(chartData, 1000, 500, 'langue')
    })

    document.getElementById("genreButton").addEventListener("click", function() {
      let chartData = preprocess.getAreaChartData(data, 'genre')
      graphs.multiLineChart(chartData, 1000, 500, 'genre')
    })
  })

  // Draw map (Louis-Maxime)
  var projection = d3.geoMercator()
  var path = d3.geoPath().projection(projection)
  d3.json("./canada.json", function(json) { 
    map.drawMap(1000, 600, json.features, path)
  })

  // Pie charts logic to integrate

  /* const svgSize = {
    width: 1500,
    height: 1200
  }

  graphs.setCanvasSize(svgSize.width, svgSize.height)
  graphs.generateMapG(svgSize.width, svgSize.height)
  graphs.generateMarkerG(svgSize.width, svgSize.height)

  build()

  function build() {
    let circlesData;

    let projection = graphs.getProjection()

    let path = graphs.getPath(projection)

    d3.csv('./telefilm.csv').then(function (data) {
      circlesData = preprocess.getLanguagePieChartData(data)
    })

    // Draw map (Marc-Andre)
    d3.json('./CanadianProvinces.geojson').then(function (data) {
      graphs.mapBackground(data, path, graphs.showMapCentroids, circlesData)
    })    

    // Draw cities markers
    // d3.json('./CanadianCities.json').then(function (data) {
    //   preprocess.convertCoordinates(data, projection, circlesData)
    //   graphs.mapMarkers(data, circlesData)
    // }) 
    
  }*/
})(d3)
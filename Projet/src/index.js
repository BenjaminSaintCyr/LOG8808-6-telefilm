import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'

(function (d3) {
  const svgSize = {
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
      // let chartData = preprocess.getLanguageLineChartData(data)
      // graphs.multiLineChart(chartData, 1000, 500)
      circlesData = preprocess.getLanguagePieChartData(data)
    })

    d3.json('./CanadianProvinces.geojson').then(function (data) {
      graphs.mapBackground(data, path, graphs.showMapCentroids, circlesData)
    })    

    // TODO: Uncomment to see cities markers
    // d3.json('./CanadianCities.json').then(function (data) {
    //   preprocess.convertCoordinates(data, projection, circlesData)
    //   graphs.mapMarkers(data, circlesData)
    // }) 
    
  }
})(d3)
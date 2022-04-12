import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'
import * as map from './scripts/map.js'

(function (d3) {
  // Draw chart
  d3.csv('./telefilm.csv').then(function(data) {
    console.log(data)
    let chartData = preprocess.getLanguageLineChartData(data)
    graphs.multiLineChart(chartData, 1000, 500)
  })

  // Draw map
  var projection = d3.geoMercator()
  var path = d3.geoPath().projection(projection)
  d3.json("./canada.json", function(json) { 
    map.drawMap(1000, 600, json.features, path)
  })
})(d3)
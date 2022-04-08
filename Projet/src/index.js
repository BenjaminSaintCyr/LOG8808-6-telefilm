import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'

(function (d3) {
  d3.csv('./telefilm.csv').then(function(data) {
    console.log(data)
    let chartData = preprocess.getLanguageLineChartData(data)
    graphs.multiLineChart(chartData, 1000, 500)
  })
})(d3)
import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'

(function (d3) {
  let circlesData;
  d3.csv('./telefilm.csv').then(function(data) {
    // let chartData = preprocess.getLanguageLineChartData(data)
    // graphs.multiLineChart(chartData, 1000, 500)
    circlesData = preprocess.getLanguagePieChartData(data)
    d3.csv('./canadacities.csv').then(function (data) {
      circlesData = preprocess.addPositionsToPieChatData(circlesData, data)
    })
  })
})(d3)
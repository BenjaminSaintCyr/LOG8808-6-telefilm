import * as preprocess from './scripts/preprocess.js'
import * as graphs from './scripts/graphs.js'
import d3Tip from 'd3-tip'


(function (d3) {
  const svgSize = {
    width: 920,
    height: 605
  }

  let projection = graphs.getProjection()
  let path = graphs.getPath(projection)
  
  graphs.setCanvasSize(svgSize.width, svgSize.height)
  graphs.generateMapG(svgSize.width, svgSize.height)
  graphs.generateMarkerG(svgSize.width, svgSize.height)
  
    // Draw chart
  d3.csv('./telefilm.csv').then(function(data) {
    const [width, height] = [900, 500]

    let chartData = preprocess.getAreaChartData(data, 'genre')
    graphs.multiLineChart(chartData, width, height, 'genre')

    document.getElementById("langueButton").addEventListener("click", function() {
      stackData = 'langue'
      let chartData = preprocess.getAreaChartData(data, 'langue', selectedProvince)
      graphs.multiLineChart(chartData, width, height, 'langue', selectedProvince)
    })

    document.getElementById("genreButton").addEventListener("click", function() {
      stackData = 'genre'
      let chartData = preprocess.getAreaChartData(data, 'genre', selectedProvince)
      graphs.multiLineChart(chartData, width, height, 'genre', selectedProvince)
    })

    let circlesData = preprocess.getLanguagePieChartData(data)

    // Change stacked bar chart depending on the province
    const provinceSelecter = (province) => {
      const chartData = preprocess.getAreaChartData(data, stackData, province)
      graphs.multiLineChart(chartData, width, height, stackData, province)
    }

    document.getElementById("unselectAll").addEventListener("click", function() {
      selectedProvince = 'None';
      graphs.clearAllHighlight();
      let chartData = preprocess.getAreaChartData(data, stackData, selectedProvince)
      graphs.multiLineChart(chartData, width, height, stackData)
    })

    // Draw map
    d3.json('./CanadianProvinces.geojson').then(function (data) {
      graphs.mapBackground(data, path, provinceSelecter)
    })

    // Draw cities markers
    d3.json('./CanadianCities.json').then(function (data) {
      preprocess.convertCoordinates(data, projection, circlesData)
      graphs.mapMarkers(data, circlesData)
    })
  })   
})(d3)
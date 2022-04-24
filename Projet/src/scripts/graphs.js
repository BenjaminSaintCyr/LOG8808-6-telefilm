export function updateToolTip(tooltip, cityName) { 
  tooltip.html("<p>" + cityName + "</p>")
}

export function multiLineChart(data, width, height, category, province) {
    d3.select("#viz-container").selectAll('*').remove()

    let xValues = data.map(elem => {
        return elem.periode
    })
    let categoryValues = data.map(elem => {
        return elem[category]
    })
    // Array of all periods, with duplicates removed
    let possibleXValues = xValues.filter(function(item, pos) {
        return xValues.indexOf(item) == pos
    })
    // Array of all categories, with duplicates removed
    let possibleCategoryValues = categoryValues.filter(function(item, pos) {
        return categoryValues.indexOf(item) == pos
    })

    let groupedData = d3.nest()
        .key(function(d) { return d.periode })
        .entries(data)

    // Valeurs préparées pour le stacked area chart (les valeurs des ordonnées sont cumulatives)
    let stackedData = d3.stack()
        .keys(possibleCategoryValues)
        .value(function(d, key){
            return d.values[possibleCategoryValues.indexOf(key)].valeurf
        })
        (groupedData)

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 80}

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

    // Add area chart title
    const provinceName = (province != undefined && province != 'None') ? province : 'Canada'
    svg.append("text")
        .text(`Financement par ${category} (${provinceName})`)
        .attr("transform", `translate(${(width - 300)/2}, 5)`)
        .attr("class", "areaChartTitle")

    
    // Set scales
    let xScale = d3.scalePoint().domain(possibleXValues).range([0, width - 300])
    let topValues = stackedData[stackedData.length - 1].map(elem => elem[1])
    let maxY = Math.max(...topValues)
    let yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0])

    var color = d3.scaleOrdinal()
    .domain(possibleCategoryValues)
    .range(["#1F77B4FF", "#D62728FF", "#2CA02CFF", "#FF7F0EFF", 
    "#9467BDFF", "#8C564BFF", "#E377C2FF", "#7F7F7FFF", "#BCBD22FF", 
    "#17BECFFF", "#AEC7E8FF", "#FFBB78FF", "#98DF8AFF", "#FF9896FF", 
    "#C5B0D5FF", "#C49C94FF", "#F7B6D2FF", "#C7C7C7FF", "#DBDB8DFF", "#9EDAE5FF"])

    // Display axes
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-15) translate(0, 5)")
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(10).tickFormat(x => {return (x / 1000).toLocaleString()}))

    // Display Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90) translate(-170, -70)")
        .text("Financement (k$)")
        .attr("font-size", "14px")

    // Draw the graph itself
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

    // --- Legend ---
    
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
            let legendName
            if(d == '0') {
                legendName = 'Festival'
            } else if(d == 'Science-fiction/Film fantastique/Conte') {
                legendName = 'Sci-fi/Fantastique'
            } else {
                legendName = d
            }
            return legendName
        })
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
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

function highlightProvince(d) {
  d.attr("fill", "#94938a").attr("stroke-width", 2).style("stroke", "black");
}

function unHihglightProvince(d) {
  d.attr("fill", "#c2c1b4").attr("stroke-width", 1).style("stroke", "white");
}

export function clearAllHighlight() {
  d3.select("#map-g")
    .selectAll(".province")
    .attr("fill", function (d) {
      return selectedProvince === d?.properties?.name ? "#94938a" : "#c2c1b4";
    })
    .attr("stroke-width", function (d) {
      return selectedProvince === d?.properties?.name ? 2 : 1;
    })
    .style("stroke", function (d) {
      return selectedProvince === d?.properties?.name ? "black" : "white";
    });
}

export function mapBackground(data, path, circlesData, onProvinceSelect) {
  d3.select("#map-g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "province")
    .attr("d", path)
    .attr("fill", "#c2c1b4")
    .style("stroke", "white")
    .on("click", function (d, i) {
      selectedProvince = d.properties.name;
      clearAllHighlight();
      onProvinceSelect(d.properties.name);
      //   highlightProvince(d3.select(this));
    })
    .on("mouseover", function (d) {
      highlightProvince(d3.select(this));
    })
    .on("mouseout", function (d) {
      if (selectedProvince !== d.properties.name) {
        unHihglightProvince(d3.select(this));
      }
    });

  // Triggers provinces pie charts appearance
  /*data.features.forEach((d) => {
    showMapCentroids(d, path, circlesData);
  });*/
}

export function getProjection () {
  return d3.geoMercator()
    .center([-94, 62])
    .scale(600)
}

export function getPath (projection) {
  return d3.geoPath()
    .projection(projection)
}

export function mapMarkers(data, circlesData, tip) {
    const sizeScale = setCitRadiusScale()
    
    let tooltip2 = d3.select("#viz-container")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
    .style("border-radius", "5px")
  .style("font-size", "10px")
.style("padding", "10px")
.style("padding-top", "3px")
.style("padding-bottom", "1px")
    circlesData.provinces.forEach(prov => {
        prov.villes.forEach((cit, key) => {
            let city = data.items.find(obj => obj.name.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === key)
            if (city !== undefined) {
                let pie = d3.pie().value(dat => dat)
                const totalMovies = cit.nbFrancais + cit.nbAnglais
                let path = d3.select('#marker-g')
                  .selectAll('idkWhyButYouNeedMe')
                  .data(pie([cit.nbFrancais, cit.nbAnglais]))
                  .enter()
                  .append('path')
                
                path.attr('d', d3.arc().innerRadius(0).outerRadius(sizeScale(totalMovies)))
                  .attr('fill', (d) => d.data === cit.nbFrancais ? "blue" : "red")
                  .attr('stroke', 'black')
                  .attr('transform', `translate(${city.x}, ${city.y})`)
                  .attr('class', 'cityPieChart')
                
              path.on('mouseover', function () {
                tooltip2.html(
                  "<strong>" + city.name + "</strong>" +
                  "<p> Anglais: " + cit.nbAnglais + "</p>" +
                  "<p> Français: " + cit.nbFrancais + "</p>");
                return tooltip2.style("visibility", "visible");
              })
            }
        })
      })
    d3.selectAll(".cityPieChart")
      .on("mousemove", function() {return tooltip2.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
      .on("mouseout", function() {return tooltip2.style("visibility", "hidden");});
}

/*export function setCityHoverHandler (data) {
  console.log('got here')

  d3.selectAll('path')
    let position = d3.select(this).attr('transform')
    console.log(position)
    .on('mouseover', tip.show().attr('transform', 'translate('))
    .on('mouseout', tip.hide())
}*/

export function showMapCentroids (d, path, circlesData) {
    let pie = d3.pie().value(dat => dat)
    const province = circlesData.provinces.get(d.properties.name)
    const [x, y] = path.centroid(d)
    const adjustedY = 
        d.properties.name === "Territoires Nord-Ouest" ? y + 125 :
        d.properties.name === "Nunavut" ? y + 300 :
        d.properties.name === "Île-du-Prince-Édouard" ? y - 13 :
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
    return d3.scaleSqrt().domain([0, 3534]).range([4, 14])
}
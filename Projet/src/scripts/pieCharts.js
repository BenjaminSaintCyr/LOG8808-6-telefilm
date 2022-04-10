export function setColorScale(data) {
    // const fullData = [...data['2009'], ...data['2021']]
    const domain = d3.extent(fullData, ({ Language }) => Language)
    return d3.scaleOrdinal().domain(domain).range("blue", "red");
}

export function positionCircles() {

}

export function drawCircles(data) {
    let pie = d3.pie().value(d => { return d.value })
    let dataReady = pie(d3.entries(data))
}

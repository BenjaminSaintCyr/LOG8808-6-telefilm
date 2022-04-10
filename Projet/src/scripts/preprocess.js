export function getLanguageLineChartData(data, province='None') {
    let newData = []

    if (province != 'None') {
        data = data.filter(elem => {
            return elem.Province == province
        })
    }
    periods.forEach(period => {
        languages.forEach(language => {
            newData.push({"periode": period, "langue": language, "valeurf": 0})
        })
    })

    console.log(newData)
    newData.forEach(mark => {
        data.forEach(elem => {
            if (elem.periode == mark.periode && elem.langue == mark.langue) {
                mark.valeurf += parseFloat(elem.valeurf)
            }
        })
    })

    return newData
}

export function getLanguagePieChartData(data) {
    let newData = { "provinces": new Map()}

    data = data.filter(element => {
        return element.pays === 'Canada' 
    })
    
    data.forEach(({ province, langue, ville }) => {
        // Data contains mix of accents and lower/upper cased cities names... 
        const upperCasedCityNoAccents = ville.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") 
        
        if (!newData.provinces.has(province)) {
            newData.provinces.set(province, { 'villes': new Map() } );
        } if (!newData.provinces.get(province).villes.has(upperCasedCityNoAccents)) {
            newData.provinces.get(province).villes.set(upperCasedCityNoAccents, {"nbFrancais": 0, "nbAnglais": 0});
        }
        langue === 'Français' ?
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbFrancais++ :
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbAnglais++
    })

    return data

}
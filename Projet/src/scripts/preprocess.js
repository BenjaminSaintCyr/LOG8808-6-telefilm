export function getLanguageLineChartData(data, province = 'None') {
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
            newData.provinces.get(province).villes.set(upperCasedCityNoAccents, {"nbFrancais": 0, "nbAnglais": 0, "long": "", "lat": ""});
        }
        langue === 'Français' ?
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbFrancais++ :
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbAnglais++
    })

    return newData
}

export function addPositionsToPieChatData(telefilmData, canData) {
    let found = null
    telefilmData.provinces.forEach(val => {
        Array.from(val.villes).map(([entryKey, entryVal]) => {
            // Maybe find a way to short-circuit the loop (array.some()?)
            canData.forEach(({ city_ascii, lng, lat }) => {
                if (city_ascii.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")  === entryKey) {
                    val.villes.get(entryKey).long = lng
                    val.villes.get(entryKey).lat = lat
                    found = entryKey
                    return
                }
            })
            // Remove cities where no geographic coordinates were found
            found === null ? val.villes.delete(entryKey) : found = null
        })
    })
    return telefilmData
}

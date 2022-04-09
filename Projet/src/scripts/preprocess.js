import { provinces } from "./constants"

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
    let newData = { "provinces": [{ province: { "villes": [{ ville: {"nbFrancais": 0, "nbAnglais": 0}}] } }]}

    data = data.filter(element => {
        return element.pays == 'Canada' 
    })
    
    data.forEach(({ province, langue, ville }) => {
        newData.push({ province, ville})
    })

    return data

}
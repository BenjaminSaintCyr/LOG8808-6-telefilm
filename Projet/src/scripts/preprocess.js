export function getLanguageLineChartData(data, province='None') {
    let newData = []

    let periods = [
        '2009-2010', 
        '2010-2011', 
        '2011-2012', 
        '2012-2013', 
        '2013-2014', 
        '2014-2015', 
        '2015-2016', 
        '2016-2017', 
        '2017-2018', 
        '2019-2020', 
        '2020-2021', 
        '2021-2022'
    ]
    let languages = [
        'Français',
        'Anglais'
    ]

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
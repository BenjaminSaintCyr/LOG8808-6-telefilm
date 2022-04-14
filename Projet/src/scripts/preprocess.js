export function getAreaChartData(data, category, province='None') {
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

    let categoryValues = data.map(elem => {
        return elem[category]
    })
    let categoryVals = categoryValues.filter(function(item, pos) {
        return categoryValues.indexOf(item) == pos
    })
    if(category == 'langue') {
        categoryVals = [
            'Français',
            'Anglais'
        ]
    } else if(category == 'genre') {
        categoryVals = [
            'Comédie',
            'Drame',
            'Référence',
            'Drame historique',
            'Documentaire',
            'Action/Aventure',
            '0',
            'Ludo-Éducatif',
            'Horreur/Suspense',
            'Comédie romantique',
            'Western',
            'Mystère/Crime/Police',
            'Film musical',
            'Science-fiction/Film fantastique/Conte',
            'Enfants',
            'Jeux',
            'Divertissement',
            'Animation'
        ]
    }

    if (province != 'None') {
        data = data.filter(elem => {
            return elem.province == province
        })
    }
    periods.forEach(period => {
        categoryVals.forEach(categoryVal => {
            newData.push({"periode": period, [category]: categoryVal, "valeurf": 0})
        })
    })

    console.log(newData)
    newData.forEach(mark => {
        data.forEach(elem => {
            // console.log(elem[category] + mark[category])
            if (elem.periode == mark.periode && elem[category] == mark[category]) {
                mark.valeurf += parseFloat(elem.valeurf)
            }
        })
    })
    return newData
}
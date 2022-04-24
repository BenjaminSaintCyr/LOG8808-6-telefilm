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
            if (elem.periode == mark.periode && elem[category] == mark[category]) {
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
    
    data.forEach(({province, langue, ville }) => {
        // Data contains mix of accents and lower/upper cased cities names... 
        const upperCasedCityNoAccents = ville.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
        
        if (!newData.provinces.has(province)) {
            newData.provinces.set(province, { 'villes': new Map(), 'nbFrancaisTot': 0, 'nbAnglaisTot': 0 } );
        } if (!newData.provinces.get(province).villes.has(upperCasedCityNoAccents)) {
            newData.provinces.get(province).villes.set(upperCasedCityNoAccents, {"nbFrancais": 0, "nbAnglais": 0});
        }
        if (langue === 'Français') {
            newData.provinces.get(province).nbFrancaisTot++
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbFrancais++
        } else {
            newData.provinces.get(province).nbAnglaisTot++
            newData.provinces.get(province).villes.get(upperCasedCityNoAccents).nbAnglais++
        }
    })

    return newData
}

export function convertCoordinates(data, projection, telefilmData) {
    data.items.forEach(items => {
        telefilmData.provinces.forEach(d => {
            if (d.villes.has(items.name.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) {
                items.x = projection(items.position.coordinates)[0]
                items.y = projection(items.position.coordinates)[1]
            }
        })   
    })
}
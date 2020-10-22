const puppeteer = require('puppeteer');
const fs = require('fs');

const getData = async () => {

    const width = 1280
    const height = 720

    // 1 - Créer une instance de navigateur
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            `--window-size=${ width },${ height }`
        ],
        defaultViewport: {
            width,
            height
        }
    })
    const page = await browser.newPage()

    // 2 - Naviguer jusqu'à l'URL cible
    await page.goto('https://www.decathlon.fr/sports')
    
    // 3 - Récupérer les données
    const result = await page.evaluate(() => {
        
        let sport ={};

        let sportsDecathlon = document.querySelectorAll('.hs-body .hs-list__link span')
        for (let i = 0; i < sportsDecathlon.length; i++) {
            let key = i
            label = sportsDecathlon[i].textContent.toLowerCase()
            sport[key]=label;
        }
        
        // Conversion en JSON
        return JSON.stringify(sport, null, 2)
    })

    // 4 - Retourner les données (et fermer le navigateur)
    browser.close()

    return result
}


// Appelle la fonction getData() et affichage les données retournées + Creation d'un fichier JSON
getData().then(value => {
    console.log(value)
    
    fs.writeFile('./sport.json', value , err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
})

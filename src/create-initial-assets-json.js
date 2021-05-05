/**
 * This script is responsible for generating the initial
 * assets.json that can later be adjusted to fit your specific needs
 *
 * You can define:
 * 1. amount of assets
 * 2. whether you want to start the collection with either 1 or 0
 * 3. what the mimeType is (jpeg, png or gif)
 */

const times = require('lodash/times')
const fs = require("fs").promises

const AMOUNT_OF_ASSETS = 15
const START_WITH_ZERO = true
const MIME_TYPE = 'image/png'

async function main() {

    const assets = times(AMOUNT_OF_ASSETS).map(i => {

        const number = START_WITH_ZERO ? i : i + 1
        const id = `PIADA${number}` // PIADA0

        const [extension] = MIME_TYPE.split("/").reverse() // png

        return {
            id,
            name: `PIADA #${number}`,
            // description: "", 
            image: `images/${id}_thumbnail.${extension}`, // images/PIADA0_thumbnail.png
            src: `images/${id}.${extension}`, // images/PIADA0.png
            type: MIME_TYPE,
            // add whatever like below
            authors: ["PIADA", "SBLYR"],
            website: "https://ada-pi.io"
        }
    })

    await fs.writeFile(__dirname + '/assets.json', JSON.stringify(assets, null, 2))
}

main()
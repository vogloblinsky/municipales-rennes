const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');

const URL =
    'https://rennes-en-commun-2020.fr/programme-des-municipales-2020-rennes-en-commun-partie2-maillage-du-territoire';
const candidatIndex = 4;
const sousThematiqueId = 'st-22';
const propositionPrefixId = 'lepape-p-';

const JSON = '../src/_data/candidats.json';

const data = require(JSON);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);

    let startIndex = parseInt(
        data[candidatIndex].propositions
            .slice(-1)[0]
            .id.replace(propositionPrefixId, '')
    );

    const propositions = await page.evaluate(
        (propositionPrefixId, sousThematiqueId, startIndex) => {
            let propositions = Array.from(
                document.querySelectorAll('.eut-message')
            );
            return propositions.map((proposition, index) => {
                return {
                    id: propositionPrefixId + (startIndex + index + 1),
                    st: sousThematiqueId,
                    label: proposition.innerText
                };
            });
        },
        propositionPrefixId,
        sousThematiqueId,
        startIndex
    );

    data[candidatIndex].propositions = [
        ...data[candidatIndex].propositions,
        ...propositions
    ];

    console.log(propositions);

    fs.writeJson(path.join(__dirname, JSON), data, async err => {
        if (err) return console.error(err);
        console.log('JSON write success!');
        await browser.close();
    });
})();

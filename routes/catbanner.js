const express = require('express');
const fs = require('fs');
const path = require('path');
const handlebars = require('express-handlebars').create();
const router = express.Router();

router.post('/', (req, res) => {

    const assets = Array.isArray(req.body.assets) ? req.body.assets : [req.body.assets];
    const title = req.body.title;
    var date = req.body.date;

    const templatePath = path.join(__dirname, `../templates/catbanner3d.hbs`);
    const templateSrc = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.handlebars.compile(templateSrc);

    const cleanTitle = cleanString(title);

    const year = new Date().getFullYear();

    date = formatDate(date);

    createDirectory(date, cleanTitle);

    handlebarsFunctionsRegisterHelpers(handlebars);

    var currentCatId = "";

    var filePath = 'outputs/' + date + '-' + cleanTitle + '/dyn-cat-banner-' + cleanTitle + '-3d-' + date + '-' + year;

    generateAssetCatbanner(assets, currentCatId, cleanTitle, filePath, template, fs);

    assets.forEach(currentAsset => {
        currentCatId = currentAsset.catId;

        const cleanCta = cleanString(currentAsset.ctaText);

        var filePath = 'outputs/' + date + '-' + cleanTitle + '/dyn-cat-banner-' + cleanTitle + '-' + cleanCta + '-3d-' + date + '-' + year;

        generateAssetCatbanner(assets, currentCatId, cleanTitle, filePath, template, fs);
    });

});

function cleanString(string) {
    return string.trim()
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
}

function formatDate(date) {
    return date.replace(/\//g, '-').replace(/\s+/g, '').toLowerCase();
}

function createDirectory(date, cleanTitle) {
    fs.mkdir('outputs/' + date + '-' + cleanTitle + '', { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        } else {
            console.log('Directory created successfully!');
        }
    });
}

function handlebarsFunctionsRegisterHelpers(handlebars) {
    handlebars.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
}

function generateAssetCatbanner(assets, currentCatId, cleanTitle, filePath, template, fs) {
    var isFrench = false;

    const output = template({ currentCatId, assets, cleanTitle, isFrench });
    isFrench = true;
    const outputFr = template({ currentCatId, assets, cleanTitle, isFrench });
    var filePathEn = filePath + '.html';
    var filePathFr = filePath + '-fr.html';

    fs.writeFile(filePathEn, output, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Base data written to file successfully!');
        }
    });

    fs.writeFile(filePathFr, outputFr, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('FR Data written to file successfully!');
        }
    });

    isFrench = false;
}

module.exports = router;
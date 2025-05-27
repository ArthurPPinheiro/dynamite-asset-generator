const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('express-handlebars').create();
const Catbanner = require('../models/catbanner');
const router = express.Router();

router.post('/', async (req, res) => {
    const rawAssetsData = Array.isArray(req.body.assets) ? req.body.assets : [req.body.assets];
    const assets = rawAssetsData.map(assetData => {
        const combinedData = {
            ...assetData, 
            title: req.body.title, 
            date: req.body.date
        }
        return new Catbanner(combinedData);
    });

    handlebarsFunctionsRegisterHelpers(handlebars);

    await fs.mkdir(assets[0].getAssetOutputDirectory());

    generateBaseCatbanner(assets);
    
    assets.forEach(currentAsset => {
        generateCatbanner(assets, currentAsset);
    });

    res.redirect('/');

});

function handlebarsFunctionsRegisterHelpers(handlebars) {
    handlebars.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
}

async function generateCatbanner(assets, currentAsset) {
    const templatePath = path.join(__dirname, `../templates/catbanner3d.hbs`);
    const templateSrc = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.handlebars.compile(templateSrc);

    let currentCatId = currentAsset.catId;
    let cleanTitle = currentAsset.cleanTitle;

    let isFrench = false;
    const output = template({ currentCatId, cleanTitle, assets, isFrench });

    isFrench = true;
    const outputFr = template({ currentCatId, cleanTitle, assets, isFrench });

    await fs.writeFile(currentAsset.getFilePath(), output);

    await fs.writeFile(currentAsset.getFilePathFrench(), outputFr);

    isFrench = false;
}

async function generateBaseCatbanner(assets){
    const templatePath = path.join(__dirname, `../templates/catbanner3d.hbs`);
    const templateSrc = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.handlebars.compile(templateSrc);

    let baseAsset = assets[0];

    let currentCatId = "";
    let cleanTitle = baseAsset.cleanTitle;

    let isFrench = false;
    const output = template({ currentCatId, cleanTitle, assets, isFrench });

    isFrench = true;
    const outputFr = template({ currentCatId, cleanTitle, assets, isFrench });

    await fs.writeFile(baseAsset.getBaseFilePath(), output);

    await fs.writeFile(baseAsset.getBaseFilePathFrench(), outputFr);

    isFrench = false;
}

module.exports = router;
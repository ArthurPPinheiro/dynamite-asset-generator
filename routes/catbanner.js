const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('express-handlebars').create();
const Catbanner = require('../models/catbanner');
const ImageHandler = require('../models/helpers/image-handler');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.fields([{name: 'imageDesktop'}, {name: 'imageMobile'}]), async (req, res) => {
    const files = req.files;
    console.log("req.body.assets", req.body.assets);
    console.log("req.body", req.body);

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

    await fs.mkdir(assets[0].getAssetOutputDirectory(), { recursive: true });

    await compressImages(assets[0], files);

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

async function compressImages(asset, files) {
    if (!files || Object.keys(files).length === 0) {
        console.log('No files were uploaded.');
        return;
    }

    const imageHandler = new ImageHandler();

    await fs.mkdir(asset.getImageOutputDirectory(), { recursive: true });

    console.log("files", files);
    console.log("files desk", files.imageDesktop);
    console.log("files mob", files.imageMobile);

    let imageTasks = [];

    for(const file of files.imageDesktop){
        console.log("file", file)
        imageTasks = [
            { quality: 75, format: 'jpeg', maxSize: 50, isMobile: false },
            { quality: 75, format: 'webp', maxSize: 50, isMobile: false }
        ];

        for(const task of imageTasks){
            await imageHandler.proccessImageNoResize(file, asset.getImageOutputDirectory(), asset.getImagePrefix() + getFileCleanName(file.originalname), task);
        } 
    }

    for(const file of files.imageMobile){
        imageTasks = [
            { quality: 75, format: 'jpeg', maxSize: 30, isMobile: true },
            { quality: 75, format: 'webp', maxSize: 30, isMobile: true }
        ];
        
        for(const task of imageTasks){
            await imageHandler.proccessImageNoResize(file, asset.getImageOutputDirectory(), asset.getImagePrefix() + getFileCleanName(file.originalname), task);
        } 
    }


    console.log('Image processing tasks completed successfully');
}

function getFileCleanName(fileName) {
    return fileName.split('.')[0];
}

module.exports = router;
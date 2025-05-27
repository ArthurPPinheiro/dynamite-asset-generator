const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('express-handlebars').create();
const Grid = require('../models/Grid');
const multer = require('multer');
const ImageHandler = require('../models/helpers/image-handler');

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('imageFile'), async (req, res) => {
    const file = req.file;

    const grid = new Grid(req.body);

    await compressImages(grid, file);

    await genereateAsset(grid);

    res.redirect('/');
});

async function genereateAsset(grid) {
    const templatePath = path.join(__dirname, `../templates/grid.hbs`);
    const templateSrc = await fs.readFile(templatePath, { encoding: 'utf-8' }); 
    const template = handlebars.handlebars.compile(templateSrc);

    const output = template({ ...grid });

    const frenchData = {
        ...grid,
        title: grid.titleFr,
        ctaText: grid.ctaTextFr, 
        altText: grid.altTextFr,
    };

    const outputFr = template({ ...frenchData });

    await fs.mkdir(grid.getAssetOutputDirectoryPath(), { recursive: true });

    await fs.writeFile(grid.getFilePath(), output);

    await fs.writeFile(grid.getFilePathFrench(), outputFr);
}

async function compressImages(grid, file) {
    if(!file || !file.path){
        console.error('Invalid file or file path');
        return;
    }

    const imageHandler = new ImageHandler();

    await fs.mkdir(grid.getImageOutputDirectoryPath(), { recursive: true });

    const imageTasks = [
        { width: 1200, height: 900, quality: 75, format: 'jpeg', maxSize: 70, isMobile: false },
        { width: 1200, height: 900, quality: 75, format: 'webp', maxSize: 70, isMobile: false },
        { width: 600, height: 450, quality: 75, format: 'jpeg', maxSize: 50, isMobile: true },
        { width: 600, height: 450, quality: 75, format: 'webp', maxSize: 50, isMobile: true },
    ]

    for(const task of imageTasks){
        await imageHandler.proccessImage(file, grid.getImageOutputDirectoryPath(), grid.getImageName(), task);
    }

    console.log('Image processing tasks completed successfully');
}

module.exports = router;
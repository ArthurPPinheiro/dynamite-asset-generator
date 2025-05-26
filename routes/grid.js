const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('express-handlebars').create();
const Grid = require('../models/Grid');
const sharp = require('sharp');
const multer = require('multer');

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

    const year = new Date().getFullYear();

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

    await fs.mkdir(grid.getImageOutputDirectoryPath(), { recursive: true });

    const imageTasks = [
        { width: 1200, height: 900, quality: 75, format: 'jpeg', maxSize: 70, isMobile: false },
        { width: 1200, height: 900, quality: 75, format: 'webp', maxSize: 70, isMobile: false },
        { width: 600, height: 450, quality: 75, format: 'jpeg', maxSize: 50, isMobile: true },
        { width: 600, height: 450, quality: 75, format: 'webp', maxSize: 50, isMobile: true },
    ]

    for(const task of imageTasks){
        await proccessImage(grid, file, task.width, task.height, task.quality, task.maxSize, task.format, task.isMobile);
    }

    console.log('Image processing tasks completed successfully');
}

async function proccessImage(grid, file, width, height, quality, max_size, format, isMobile = false){
    if(!file || !file.path){
        console.error('Invalid file or file path');
        return;
    }

    let currentQuality = quality;
    const minQuality = 10;
    const qualityStep = 5;
    let processedBuffer;
    let processedInfo;
    const maxAttempts = 20;

    let sharpInstance = sharp(file.path).resize(width, height);
    for(let attempt = 1; attempt <= maxAttempts; attempt++){

        if (format === 'jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality: currentQuality, progressive: true, optimizeScans: true });
        } 
        else if (format === 'webp') {
            sharpInstance = sharpInstance.webp({ quality: currentQuality });
        }

        try {
            const output = await sharpInstance.toBuffer({ resolveWithObject: true });
            const currentSizeKB = output.info.size / 1000;

            console.log(`Attempt ${attempt}: Quality ${currentQuality || 'N/A'}, Size: ${currentSizeKB.toFixed(2)}KB`);

            if (currentSizeKB <= max_size) {
                processedBuffer = output.data;
                processedInfo = output.info;
                console.log('Image size is within the acceptable limit.');
                break; 
            }

            if (currentQuality > minQuality) {
                currentQuality -= qualityStep;
                if (currentQuality < minQuality) currentQuality = minQuality;
            } else {
                processedBuffer = output.data;
                processedInfo = output.info;
                console.warn(`Could not reduce size further for ${format} or min quality reached. Final attempt size: ${currentSizeKB.toFixed(2)}KB`);
                break;
            }
        } catch (err) {
            console.error(`Error during sharp processing attempt ${attempt} for ${format}:`, err);
            return null;
        }
    }
    
    if (processedBuffer) {
        const finalFileName = grid.getFileName() + (isMobile ? '-Mobile' : '') + '.' + format;
        const finalFilePath = path.join(grid.getImageOutputDirectoryPath(), finalFileName);
        try {
            await fs.writeFile(finalFilePath, processedBuffer); 
            console.log(`Image processed and saved as ${finalFilePath}. Final size: ${(processedInfo.size / 1000).toFixed(2)}KB`);
            return finalFilePath;
        } catch (err) {
            console.error('Error writing final image to file:', err);
            return null;
        }
    } else {
        console.error(`No processed buffer to save for ${format}${isMobile ? ' (Mobile)' : ''}. Original file: ${file.originalname}`);
        return null;
    }
}
module.exports = router;
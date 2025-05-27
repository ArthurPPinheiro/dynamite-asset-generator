const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageHandler{
    constructor(){}

    async proccessImage(file, outputDirectory, outputFileName, options){
        let currentQuality = options.quality;
        const minQuality = 10;
        const qualityStep = 5;
        let processedBuffer;
        let processedInfo;
        const maxAttempts = 20;

        let sharpInstance = sharp(file.path).resize(options.width, options.height);
        for(let attempt = 1; attempt <= maxAttempts; attempt++){
            if (options.format === 'jpeg') {
                sharpInstance = sharpInstance.jpeg({ quality: currentQuality, progressive: true, optimizeScans: true });
            } 
            else if (options.format === 'webp') {
                sharpInstance = sharpInstance.webp({ quality: currentQuality });
            }
    
            try {
                const output = await sharpInstance.toBuffer({ resolveWithObject: true });
                const currentSizeKB = output.info.size / 1000;
    
                console.log(`Attempt ${attempt}: Quality ${currentQuality || 'N/A'}, Size: ${currentSizeKB.toFixed(2)}KB`);
    
                if (currentSizeKB <= options.maxSize) {
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
                    console.warn(`Could not reduce size further for ${options.format} or min quality reached. Final attempt size: ${currentSizeKB.toFixed(2)}KB`);
                    break;
                }
            } catch (err) {
                console.error(`Error during sharp processing attempt ${attempt} for ${options.format}:`, err);
                return null;
            }
        }
        
        if (processedBuffer) {
            const finalFileName = outputFileName + (options.isMobile ? '-Mobile' : '') + '.' + options.format;
            const finalFilePath = path.join(outputDirectory, finalFileName);
            try {
                await fs.writeFile(finalFilePath, processedBuffer); 
                console.log(`Image processed and saved as ${finalFilePath}. Final size: ${(processedInfo.size / 1000).toFixed(2)}KB`);
                return finalFilePath;
            } catch (err) {
                console.error('Error writing final image to file:', err);
                return null;
            }
        } else {
            console.error(`No processed buffer to save for ${options.format}${options.isMobile ? ' (Mobile)' : ''}. Original file: ${file.originalname}`);
            return null;
        }
    }
}

module.exports = ImageHandler;
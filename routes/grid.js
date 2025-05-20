const express = require('express');
const fs = require('fs');
const path = require('path');
const handlebars = require('express-handlebars').create();
const router = express.Router();
const Grid = require('../models/Grid');

router.post('/', (req, res) => {
    const grid = new Grid(req.body);

    const templatePath = path.join(__dirname, `../templates/grid.hbs`);
    const templateSrc = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.handlebars.compile(templateSrc);

    const year = new Date().getFullYear();

    const output = template({ ...grid });

    grid.title = grid.titleFr;
    grid.ctaText = grid.titleFr;
    grid.altText = grid.altTextFr;

    const outputFr = template({ ...grid });

    fs.mkdir('outputs/' + grid.date + '-' + grid.cleanTitle, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        } else {
            console.log('Directory created successfully!');
        }


        var filePath = 'outputs/' + grid.date + '-' + grid.cleanTitle + '/dyn-grid-' + grid.cleanTitle + '-' + grid.date + '-' + year + '.html';
        var filePathFr = 'outputs/' + grid.date + '-' + grid.cleanTitle + '/dyn-grid-' + grid.cleanTitle + '-' + grid.date + '-' + year + '-fr.html';

        fs.writeFile(filePath, output, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written to file successfully!');
            }
        });

        fs.writeFile(filePathFr, outputFr, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written to file successfully!');
            }
        });
    }
    );

    res.redirect('/');
});

module.exports = router;
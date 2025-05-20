const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const catbanner = require('./routes/catbanner');
const grid = require('./routes/grid');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('index'));
app.use('/catbanner', catbanner);
app.use('/grid', grid);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
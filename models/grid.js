class Grid {
    constructor({ title, ctaText, altText, titleFr, ctaTextFr, altTextFr, catId, width, alignment, color, image, imageFile, assetType, date }) {
        this.date = this.generateDate(date);
        this.title = title;
        this.ctaText = ctaText;
        this.altText = altText;
        this.titleFr = titleFr;
        this.ctaTextFr = ctaTextFr;
        this.altTextFr = altTextFr;
        this.catId = catId;
        this.width = width;
        this.alignment = alignment;
        this.color = color;
        this.imageFile = imageFile;
        this.cleanTitle = this.cleanString(title);
        this.image = this.getImagePath();
        this.formattedDate = this.cleanString(this.getDateMonthDay());
    }

    generateDate(date){
        const dateArray = date.split('-');
        const year = dateArray[0];
        const month = (dateArray[1] - 1);
        const day = dateArray[2];
        return new Date(year, month, day);
    }

    getMonthName() {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[this.date.getMonth()];
    }

    cleanString(string) {
        return string.trim()
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    }

    getDateMonthDay() {
        const month = this.cleanString(this.getMonthName());
        const day = this.date.getDate().toString().padStart(2, '0');
        return `${month}${day}`;
    }

    getAssetOutputDirectoryPath() {
        return 'outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle;
    }

    getImageOutputDirectoryPath() {
        return 'outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/images/';
    }

    getFilePath() {
        return 'outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-grid-' + this.cleanTitle + '-' + this.getDateMonthDay() + '-' + this.date.getFullYear() + '.html';
    }

    getFilePathFrench() {
        return 'outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-grid-' + this.cleanTitle + '-' + this.getDateMonthDay() + '-' + this.date.getFullYear() + '-fr.html';
    }

    getImageName() {
        return `Grids-${this.getDateMonthDay()}-${this.cleanTitle}-Img`;
    }

    getImagePath() {
        const monthName = this.getMonthName();
        const monthNumber = (this.date.getMonth() + 1).toString().padStart(2, '0');

        return `${monthNumber}-${monthName}/${this.getImageName()}`;
    }
}

module.exports = Grid;
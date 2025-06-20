class Catbanner {
    constructor({
        title,
        date,
        ctaText,
        imageAlt,
        catId,
        image,
        imageMobile,
        desktopOnly,
        ctaTextFr,
        imageAltFr
    }){
        this.title = title;
        this.date = this.generateDate(date);
        this.ctaText = ctaText;
        this.ctaTextFr = ctaTextFr;
        this.imageAltFr = imageAltFr;
        this.cleanCta = this.cleanString(ctaText);
        this.imageAlt = imageAlt;
        this.catId = catId;
        this.image = image;
        this.imageMobile = imageMobile;
        this.desktopOnly = desktopOnly != undefined ? true : false;
        this.cleanTitle = this.cleanString(title);
        this.formattedDate = this.cleanString(this.getDateMonthDay());
        this.image = this.getImagePath();
    }

    cleanString(string) {
        return string.trim()
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
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

    getDateMonthDay() {
        const month = this.cleanString(this.getMonthName());
        const day = this.date.getDate().toString().padStart(2, '0');
        return `${month}${day}`;
    }

    getImageName() {
        return `${this.getMonthName()}-${this.cleanTitle}-${this.capitalize(this.cleanCta)}`;
    }

    getImagePrefix() {
        return `${this.getMonthName()}-${this.cleanTitle}-`;
    }

    getImagePath() {
        const monthName = this.getMonthName();
        const monthNumber = (this.date.getMonth() + 1).toString().padStart(2, '0');

        return `${monthNumber}-${monthName}/${this.getImageName()}`;
    }

    getImageOutputDirectory() {
        return `tmp/outputs/${this.getDateMonthDay()}-${this.cleanTitle}/images/`;
    }

    getAssetOutputDirectory() {
        return `tmp/outputs/${this.getDateMonthDay()}-${this.cleanTitle}/`;
    }

    getFilePath() {
        return 'tmp/outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-catbanner-' + this.cleanTitle + '-' + this.cleanCta + '-3d-' + this.getMonthName().toLowerCase() + '-' + this.date.getFullYear() + '.html';
    }

    getFilePathFrench() {
        return 'tmp/outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-catbanner-' + this.cleanTitle + '-' + this.cleanCta + '-3d-' + this.getMonthName().toLowerCase() + '-' + this.date.getFullYear() + '-fr.html';
    }

    getBaseFilePath() {
        return 'tmp/outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-catbanner-' + this.cleanTitle + '-3d-' + this.getMonthName().toLowerCase() + '-' + this.date.getFullYear() + '.html';
    }

    getBaseFilePathFrench() {
        return 'tmp/outputs/' + this.getDateMonthDay() + '-' + this.cleanTitle + '/dyn-catbanner-' + this.cleanTitle + '-3d-' + this.getMonthName().toLowerCase() + '-' + this.date.getFullYear() + '-fr.html';
    }

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

}

module.exports = Catbanner;
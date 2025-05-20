class Grid {
    constructor({ title, ctaText, altText, titleFr, ctaTextFr, altTextFr, catId, width, alignment, color, image, assetType, date }) {
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
        this.image = image;
        this.cleanTitle = Grid.cleanString(title);
        this.date = Grid.formatDate(date);
    }

    static cleanString(string) {
        return string.trim()
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    }
    
    static formatDate(date) {
        return date.replace(/\//g, '-').replace(/\s+/g, '').toLowerCase();
    }
}

module.exports = Grid;
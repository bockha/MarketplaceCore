const fs = require('fs');
const path = require('path');
const config = require('../config/config_loader');
const logger = require('../global/logger');
const seedRandom = require('seedrandom');
const crypto = require('crypto');

const IMAGE_DIR = 'images/recipes/';
const DEFAULT_IMAGE = 'images/recipes/default.svg';

const self = {};

function randomInt(low, high, seed) {
    if (seed) {
        return Math.floor(seedRandom(seed)() * (high - low) + low);
    }
    else {
        return Math.floor(Math.random() * (high - low) + low);
    }
}


self.getRandomImagePath = function () {
    try {
        const files = fs.readdirSync(IMAGE_DIR);

        const randomIndex = randomInt(0, files.length);

        return path.join(IMAGE_DIR, files[randomIndex]);
    }
    catch (err) {
        logger.crit(err);

        return DEFAULT_IMAGE;
    }
};

self.getDefaultImagePathForUUID = function (uuid) {
    try {
        const files = fs.readdirSync(IMAGE_DIR);

        const randomIndex = randomInt(0, files.length, uuid);

        return path.join(IMAGE_DIR, files[randomIndex]);
    }
    catch (err) {
        logger.crit(err);

        return DEFAULT_IMAGE;
    }
};

self.saveImage = function (user, tdName, image) {
    const imageName = crypto.createHash('md5').update(user + tdName).digest('hex') + '.svg';

    const filePath = path.join(IMAGE_DIR, imageName);

    fs.writeFile(filePath, image);

    return IMAGE_DIR + imageName;
};


module.exports = self;
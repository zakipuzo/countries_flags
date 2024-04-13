const axios = require('axios');
const fs = require('fs');
const path = require('path');


const countryCodes = require("./countries.js")?.map(c => c.code?.toLowerCase());


async function downloadImage(countryCode) {
  const url = `https://www.geonames.org/flags/x/${countryCode}.gif`;
  const imagePath = path.join(__dirname, 'flags', `${countryCode}.gif`); 

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(imagePath));
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve());
      response.data.on('error', (err) => reject(err));
    });
  } catch (error) {
    console.error(`Error downloading image for ${countryCode}: ${error.message}`);
  }
}


function createOutputFolder() {
  const outputFolder = path.join(__dirname, 'flags');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
}


async function downloadAllImages() {
  createOutputFolder();
  for (const code of countryCodes) {
    await downloadImage(code.toLowerCase());
  }
}


downloadAllImages()
  .then(() => console.log('All images downloaded successfully'))
  .catch((error) => console.error('Error downloading images:', error));

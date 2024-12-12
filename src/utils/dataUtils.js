const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data.json'); // Path to the JSON file

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        return {};
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
}

module.exports = { loadData, saveData };

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { parse } = require('csv-parse');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'space_missions_dataset.csv');

    const results = [];
    fs.createReadStream(filePath)
        .pipe(parse({ columns: true }))
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            console.log('CSV Data:', results);
            res.json(results);
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Error reading CSV file' });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

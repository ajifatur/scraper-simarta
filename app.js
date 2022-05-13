const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    axios
        .get('https://simarta.unnes.ac.id/jadwal_ruangan')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('#schedule .table tbody tr').each(function(i, elem) {
                    data[i] = {
                        ruang: $(elem).find('td:nth-child(1)').text(),
                        tanggal: $(elem).find('td:nth-child(2)').text(),
                        waktu: $(elem).find('td:nth-child(3)').text(),
                        unit_pemakai: $(elem).find('td:nth-child(4)').text(),
                        jumlah_peserta: $(elem).find('td:nth-child(5)').text(),
                        peminjam: $(elem).find('td:nth-child(6)').text(),
                        keperluan_label: $(elem).find('td:nth-child(7) p.text-muted').text(),
                        keperluan_deskripsi: $(elem).find('td:nth-child(7) span').text(),
                    };
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});
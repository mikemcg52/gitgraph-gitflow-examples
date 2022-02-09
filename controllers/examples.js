const info = require('../data/exampleData.json');

module.exports = {
    example1: (req, res) => {
        res.render('example1', { 
            title: 'Single development branch w/Feature branches',
            data: info.example1
        });
    },

    example2: (req, res) => {
        res.render('example2', {
            title: 'Using parallel Release branches',
            data: info.example2
        })
    }
}
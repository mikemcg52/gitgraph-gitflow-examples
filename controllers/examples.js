const info = require('../data/exampleData.json');

module.exports = {
    example1: (req, res) => {
        res.render('example1', { 
            title: 'Single development branch w/Feature branches',
            data: info.example1
        });
    }
}
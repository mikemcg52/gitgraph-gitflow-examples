const info = require('../data/exampleData.json');

module.exports = {
    example1: (req, res) => {
        res.render('example1', { 
            title: 'Standard Gitflow Approach',
            data: info.example1
        });
    },

    example2: (req, res) => {
        res.render('example2', {
            title: 'Enhanced Gitflow Approach',
            data: info.example2
        })
    },

    example3: (req, res) => {
        res.render('example3', {
            title: 'Dev. Branch Only Approach',
            data: info.example3
        })
    }
}
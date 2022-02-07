const data = require("../data/exampleData.json");

module.exports = {
    example1: (req, res) => {
        console.log(data.example1)
        res.render('example1', {
            title: "Single development branch w/Feature branches",
            data: data.example1
        })
    }
}

const mongoose = require('mongoose');

// Schema cho ô tô
const carSchema = new mongoose.Schema({
    name: String,
    manufacturer: String,
    year: Number,
    price: Number,
    description: String
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

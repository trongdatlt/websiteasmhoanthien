const express = require('express');
const Car = require('../models/car');
const router = express.Router();

// Lấy danh sách xe
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.render('index', { cars: cars }); // Render giao diện kèm danh sách xe
    } catch (err) {
        res.status(400).send('Error fetching cars');
    }
});
// Endpoint trả về danh sách xe dưới dạng JSON
router.get('/api', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars); // Trả về JSON thay vì render HTML
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});


router.post('/', async (req, res) => {
    const { name, manufacturer, year, price, description } = req.body;
    const car = new Car({ name, manufacturer, year, price, description });

    try {
        await car.save();
        res.redirect('/cars'); // Quay về danh sách sau khi thêm
    } catch (err) {
        res.status(400).send('Error adding car');
    }
});


router.post('/api/', async (req, res) => {
    const { name, manufacturer, year, price, description } = req.body;
    const car = new Car({ name, manufacturer, year, price, description });

    try {
        await car.save(); // Lưu xe mới
        const cars = await Car.find(); // Lấy toàn bộ danh sách xe
        res.status(200).json(cars); // Trả về danh sách xe dưới dạng JSON
    } catch (err) {
        res.status(400).json({ message: 'Error adding car', error: err.message });
    }
});


// Cập nhật thông tin xe
router.put('/:id', async (req, res) => {
    const { name, manufacturer, year, price, description } = req.body;

    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { name, manufacturer, year, price, description },
            { new: true } // Trả về bản ghi đã cập nhật
        );

        if (!car) {
            return res.status(404).send('Car not found');
        }

        res.redirect('/cars'); // Chuyển về danh sách sau khi cập nhật
    } catch (err) {
        res.status(400).send('Error updating car');
    }
});


router.put('/api/:id', async (req, res) => {
    const { name, manufacturer, year, price, description } = req.body;

    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { name, manufacturer, year, price, description },
            { new: true } // Trả về bản ghi đã cập nhật
        );

        if (!car) {
            return res.status(404).send('Car not found');
        }

        const cars = await Car.find(); // Lấy toàn bộ danh sách xe
        res.status(200).json(cars); // Trả về danh sách xe dưới dạng JSON
    } catch (err) {
        res.status(400).send('Error updating car');
    }
});



// Xóa xe
router.delete('/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Car deleted successfully' });
    } catch (err) {
        res.status(400).send('Error deleting car');
    }
});
router.get('/edit/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        res.render('editCar', { car });
    } catch (err) {
        res.status(400).send('Error loading car');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).send({ message: 'Car not found' });
        }
        res.status(200).send(car);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching car details' });
    }
});

module.exports = router;

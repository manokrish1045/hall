const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Store rooms and bookings in memory (replace with database in production)
let rooms = [];
let bookings = [];

// API routes

// Create a Room
app.post('/rooms', (req, res) => {
    const { seats, amenities, price_per_hour } = req.body;
    const room = {
        room_id: generateId(),
        seats,
        amenities,
        price_per_hour
    };
    rooms.push(room);
    res.json({ room_id: room.room_id, message: 'Room created successfully' });
});

// Book a Room
app.post('/bookings', (req, res) => {
    const { customer_name, date, start_time, end_time, room_id } = req.body;
    const room = rooms.find(room => room.room_id === room_id);
    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }

    const booking = {
        booking_id: generateId(),
        customer_name,
        date,
        start_time,
        end_time,
        room_id
    };
    bookings.push(booking);
    res.json({ booking_id: booking.booking_id, message: 'Room booked successfully' });
});

// List all Rooms with Booked Data
app.get('/rooms/bookings', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const booking = bookings.find(booking => booking.room_id === room.room_id);
        return {
            room_name: room.room_id,
            booked_status: !!booking,
            customer_name: booking ? booking.customer_name : '',
            date: booking ? booking.date : '',
            start_time: booking ? booking.start_time : '',
            end_time: booking ? booking.end_time : ''
        };
    });
    res.json(roomsWithBookings);
});

// List all customers with booked Data
app.get('/customers/bookings', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(room => room.room_id === booking.room_id);
        return {
            customer_name: booking.customer_name,
            room_name: room ? room.room_id : '',
            date: booking.date,
            start_time: booking.start_time,
            end_time: booking.end_time
        };
    });
    res.json(customersWithBookings);
});

// List how many times a customer has booked the room
app.get('/customers/:customer_name/bookings', (req, res) => {
    const { customer_name } = req.params;
    const customerBookings = bookings.filter(booking => booking.customer_name === customer_name);
    res.json(customerBookings);
});

// Helper function to generate unique IDs
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const { ServerDescriptionChangedEvent } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
//const dotenv = require('dotenv');
const connectionString = "mongodb+srv://lavenderbd:8RlV8tczen0teUF0@stardewbundletracker.73uzm.mongodb.net/Bundles?retryWrites=true&w=majority&appName=StardewBundleTracker";
const PORT = 3000;
const app = express();
const API_BASE_URL = 'http://localhost:3000';

app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const itemSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    additionalInfo: String,
    season: String,
    userId: String,
    checked: { type: Boolean, default: false }
});

//module.exports = mongoose.model('Item', itemSchema);

const Item = mongoose.model('Item', itemSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stardew_tracker.html'));
});

app.get("/items", async (req, res) => {
    const season = req.query.season;
    let items;

    if (season) {
        items = await Item.find({ season: season });
    } else {
        items = await Item.find({});
    }

    res.json(items);
});

app.get("/items/:id", async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});

app.post("/items", async (req, res) => {
    const item = await Item.create(req.body);
    res.json(item);
});

app.put("/items/:id", async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body);
    res.json(item);
});

app.delete("/items/:id", async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    res.json(item);
});

function connectDB(url) {
    return mongoose.connect(url);
}

async function start() {
    try {
        await connectDB(connectionString)
        app.listen(PORT, () => {
            console.log(`App running on PORT ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}

start();
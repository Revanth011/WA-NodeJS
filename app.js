const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

require('dotenv').config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix + '_' + file.originalname}`.replaceAll(' ', '_'))
    }
})

const upload = multer({ storage: storage });

const accountSid = 'AC0cf4f516031c37465db3cbcaf3608205';
const authToken = 'e6f7cc6897123060e65096799ac09dfc';
const client = require('twilio')(accountSid, authToken);


app.get("/", (req, res) => {
    res.send("Homepage");
})

app.post("/wa/send/img", upload.single('waFile'), async (req, res) => {
    if (!req.file) {
        try {
            await client.messages.create({
                from: 'whatsapp:+14155238886', // shared WhatsApp number
                body: 'cool awesome!',
                to: 'whatsapp:+918197463361' // change this to your personal WhatsApp number
            }).then(message => console.log(`Message sent: ${message.sid}`));
        } catch (err) { console.log(err) }
    } else {
        try {
            await client.messages.create({
                from: 'whatsapp:+14155238886', // shared WhatsApp number
                mediaUrl: `${process.env.URI}/uploads/${req.file.filename}`,
                to: 'whatsapp:+918197463361' // change this to your personal WhatsApp number
            }).then(message => console.log(`Message sent: ${message.sid}`));
        } catch (err) { console.log(err) }
    }
    res.send("sent")
})

app.post("/wa/recieve", async (req, res) => {
    console.log(req.body);
    res.send("Recieved")
})

app.listen(8080, () => console.log("Server Running"));
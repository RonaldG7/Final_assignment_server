const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/mainRouter');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const { Server } = require('socket.io')
const http = require('http')
const commentsSchema = require('./models/commentsSchema')

const server = http.createServer(app)

mongoose.connect(process.env.MONGO_KEY).then((res) => {
    console.log("Successfully connected to DB");
}).catch((err) => {
    console.log("Failed to connect. Message: " + err)
});

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_KEY,
        }),
    })
);

const origin = process.env.PRODUCTION === "true" ? process.env.ORIGIN_PROD : process.env.ORIGIN_DEV

app.use(cors({credentials: true, origin}))
app.use(express.json());
app.use("/", router);

const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("connected",socket.id)

    socket.on("join_topic", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })
    socket.on("new_comment", async(data) => {
        setTimeout(async () => {
            const items = await commentsSchema.count({topicId: data.topicId})
            const totalPages = Math.ceil(items / 10)
            const comments = await commentsSchema
                .find({topicId: data.topicId})
                .limit(10)
                .skip(10 * (data.page - 1))
            socket.to(data.topicId).emit("update_topic", {totalPages, comments})
        }, 1000)

    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
})

server.listen(process.env.PORT);
import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import path from 'path';
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import usersRoutes from "./routes/users.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import uploadRoutes from "./routes/upload.route.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/channel', channelRoutes);

app.use(express.static(path.join(__dirname, "/frontend/build")))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server started at PORT: ${PORT}`);
});
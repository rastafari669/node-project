const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const cardsRouter = require("./routes/cards")
require('dotenv/config')



const app = express();

const morgan = require('morgan');


mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log("Connected to mongoDB"))
.catch((err) => console.log("Could not connect to mongoDB", err));

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/cards",cardsRouter);


const PORT = 3000
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))


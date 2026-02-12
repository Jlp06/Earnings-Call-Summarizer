require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analysisRoutes = require("./routes/routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analysisRoutes);

app.get("/", (req, res) => {
    res.send("Earnings Call Analyzer Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


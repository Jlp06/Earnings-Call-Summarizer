const express = require("express");
const multer = require("multer");

const { analyzePDF } = require("../controllers/controller");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("file"), analyzePDF);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orgController = require("../controllers/orgController");

router.post("/", auth, orgController.createOrg);

module.exports = router;

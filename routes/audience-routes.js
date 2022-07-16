const express = require("express");
const { check } = require("express-validator");

const audienceControllers = require('../controllers/audience-controllers');

const router = express.Router();

router.post(
    '/signup',
    [
        check('email').normalizeEmail().isEmail()
    ],
    audienceControllers.addAudienceMember
);

module.exports = router;
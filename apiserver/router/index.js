const channel = require('./channel')
const cors = require('./filter/cors');
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({
    extended: false
}), express.json())
router.use(cors)
router.use('/channel', channel)
module.exports = router
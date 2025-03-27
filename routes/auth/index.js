const router = require('express').Router()

const { postRegister } = require('./register')
const { postResendVerification } = require('./resend-verification')
const { getVerifyAccount, postVerifyAccount } = require('./verify-account')

router.post('/register', postRegister),
router.post('/verify', postVerifyAccount)
router.get('/verify', getVerifyAccount)
router.post('/resend', postResendVerification)

module.exports = router
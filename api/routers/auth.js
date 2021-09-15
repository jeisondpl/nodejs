const express = require('express');
const crypto = require('crypto')
const Users = require('../models/Users');
const jwt = require('jsonwebtoken')
const router = express.Router();
const { isAuthenticated } = require('../auth')


export const sigToken = ({ _id }) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365
    })
}


router.post('/register', (req, res) => {

    const { email, password } = req.body
    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64')
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key) => {
            const encryptePassword = key.toString('base64')
            Users.findOne({ email }).exec()
                .then(user => {
                    if (user) {
                        return res.send('usuario ya existe')
                    }
                    Users.create({
                        email,
                        password: encryptePassword,
                        salt: newSalt,
                    }).then(() => {
                        res.send('Usuario creado con exito')
                    })
                })

        })
    })

});

router.post('/login', (req, res) => {

    const { email, password } = req.body
    Users.findOne({ email }).exec()
        .then(user => {
            if (!user) {
                return res.send('Ususario y password incorrecta')
            }
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const encryptePassword = key.toString('base64')
                if (user.password === encryptePassword) {
                    const token = sigToken(user._id)
                    return res.send({ token })
                }
                res.send('Usuario y/o password incorrecta')
            })
        })
});

router.get('/me', isAuthenticated, (req, res) => {
    req.send(req.user)
});

module.exports = router
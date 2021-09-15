const express = require('express');
const Orders = require('../models/Orders');
const { isAuthenticated, hasRoles } = require('../auth')


const router = express.Router();

router.get('/', (req, res) => {
    Orders.find()
        .exec()
        .then(x => res.status(200).send(x));
});

router.get('/:id', (req, res) => {
    Orders.findById(req.params.id)
        .exec()
        .then(x => res.status(200).send(x));
});

// isAuthenticated
router.post('/', (req, res) => {
    // const { _id } = req.user
    // Orders.create({ ...req.body, user_id: _id }).then(x => res.status(201).send(x));
    Orders.create(req.body).then(x => res.status(201).send(x));

});

// hasRole(['user','admin'])
// isAuthenticated
router.put('/:id', (req, res) => {
    Orders.findOneAndUpdate(req.params.id, req.body)
        .then(() => res.sendStatus(204));
});
// isAuthenticated
router.delete('/:id', (req, res) => {
    Orders.findOneAndDelete(req.params.id)
        .exec()
        .then(() => res.sendStatus(204));
});

module.exports = router;
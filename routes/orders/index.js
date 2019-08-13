const controller = require('./controller');
const express = require('express');
const router = express.Router();

router.get('/', controller.get);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;

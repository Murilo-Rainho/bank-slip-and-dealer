const { Router } = require('express');

const {
  getSlipsController,
} = require('../controllers/slips');

const router = Router();

router.get('/:id', getSlipsController);

module.exports = router;

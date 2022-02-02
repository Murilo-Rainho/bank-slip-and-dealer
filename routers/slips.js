const { Router } = require('express');

const {
  getSlipsController,
} = require('../controllers/slips');

const {
  verifyIsAllNumber,
  verifySlipType,
} = require('../services/middlewares');

const router = Router();

router.get('/:typeableLine',
  verifyIsAllNumber,
  verifySlipType,
  getSlipsController);

module.exports = router;

const { Router } = require('express');

const {
  getSlipsController,
} = require('../controllers/slips');

const {
  verifyIsAllNumber,
  verifySlipType,
  checkDVs,
} = require('../services/middlewares');

const router = Router();

router.get('/:typeableLine',
  verifyIsAllNumber,
  verifySlipType,
  checkDVs,
  getSlipsController);

module.exports = router;

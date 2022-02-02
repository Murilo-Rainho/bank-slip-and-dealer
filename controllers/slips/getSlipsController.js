const { getSlipsService } = require('../../services/slips');

module.exports = (req, res, next) => {
  try {
    const { typeableLine } = req.params;
    const { typeableLineInfo } = req;
  
    const serviceResponse = getSlipsService(typeableLine, typeableLineInfo);

    return res.status(200).json(serviceResponse);
  } catch (error) {
    next(error)
  }
};

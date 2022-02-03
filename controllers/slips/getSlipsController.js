const { getSlipsService } = require('../../services/slips');

module.exports = (req, res, next) => {
  try {
    const { typeableLine } = req.params;
    const { typeableLineInfo } = req;
  
    const { data, message } = getSlipsService(typeableLine, typeableLineInfo);

    if (message) {
      return res.status(400).json({ message });
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error)
  }
};

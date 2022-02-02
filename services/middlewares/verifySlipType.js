module.exports = (req, res, next) => {
  const { typeableLine } = req.params;

  const slipTypeObject = {};

  if (typeableLine.length === 48) slipTypeObject.type = 'dealer';
  if (typeableLine.length === 47) slipTypeObject.type = 'bank';
  else {
    const errorResponse = {
      message: 'This typeable line is not valid',
    };

    return res.status(400).json(errorResponse);
  }

  req.typeableLineInfo = {
    type: slipTypeObject.type,
  };

  next();
};

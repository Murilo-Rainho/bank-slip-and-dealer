module.exports = (req, res, next) => {
  const { digitableLine } = req.params;

  const slipTypeObject = {
    digitableLineLength: digitableLine.length,
  };

  if (digitableLine.length === 48) slipTypeObject.type = 'dealer';
  if (digitableLine.length === 47) slipTypeObject.type = 'bank';
  else {
    const errorResponse = {
      message: 'This digitable line is not valid',
    };

    return res.status(400).json(errorResponse);
  }

  req.slipType = slipTypeObject;

  next();
};

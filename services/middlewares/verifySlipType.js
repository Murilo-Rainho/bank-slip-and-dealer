module.exports = (req, res, next) => {
  const { typeableLine } = req.params;

  const slipTypeObject = {};
  let errorResponse;

  switch (typeableLine.length) {
    case 47: // se a linha digitável tiver 47 caractéres, é uma linha digitável de um boleto bancário
      slipTypeObject.type = 'bank';
      break;

    case 48: // se a linha digitável tiver 48 caractéres, é uma linha digitável de um boleto de concessionária
      slipTypeObject.type = 'dealer';
      break;

    default:
      errorResponse = {
        message: 'This typeable line is not valid',
      };
      break;
  }

  if (errorResponse) {
    return res.status(400).json(errorResponse);
  }

  req.typeableLineInfo = {
    type: slipTypeObject.type,
  };

  next();
};

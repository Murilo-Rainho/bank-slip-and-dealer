module.exports = (req, res, next) => {
  const { typeableLine } = req.params;
  
  if (isNaN(Number(typeableLine))) { // Se tiver um único caracter que não é um número, retornará "true", entrando nessa case
    const errorObject = {
      message: 'The typeable line should be made up of numbers only'
    };

    return res.status(400).json(errorObject);
  }

  next();
};

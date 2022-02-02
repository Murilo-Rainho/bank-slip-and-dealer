module.exports = (req, res, next) => {
  const { typeableLine } = req.params;

  const typeableLineArray = typeableLine.split();
  
  typeableLineArray.forEach((character) => {
    if (isNaN(Number(character))) {
      const errorObject = {
        message: 'The typeable line should be made up of numbers only'
      };

      return res.status(400).json(errorObject);
    }
  });

  next();
};

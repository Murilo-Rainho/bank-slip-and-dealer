const getFields = (typeableLine) => {
  const fieldOne = typeableLine.slice(0, 9).split('');
  fieldOne.reverse();

  const fieldTwo = typeableLine.slice(10, 20).split('');
  fieldTwo.reverse();

  const fieldThree = typeableLine.slice(21, 31).split('');
  fieldThree.reverse();

  return [fieldOne, fieldTwo, fieldThree];
};

const getDVs = (typeableLine) => {
  const dvOne = Number(typeableLine[9]);
  const dvTwo = Number(typeableLine[20]);
  const dvThree = Number(typeableLine[31]);

  return [dvOne, dvTwo, dvThree];
};

const calculationDVModuleTeen = (invertedFieldArray) => {
  const summedNumbers = invertedFieldArray.reduce((acc, curr, index) => {
    let multiplier = 1;

    if (index % 2 === 0) multiplier = 2;

    let product = curr * multiplier;

    if (product >= 10) {
      const productArray = product.toString().split('')

      product = productArray.reduce((acc, curr) => Number(acc) + Number(curr));
    }

    return Number(product) + acc;
  }, 0);

  const accurateTen = Math.ceil(summedNumbers / 10) * 10

  const restNumber = summedNumbers % 10;

  const resultArrayDigit = (accurateTen - restNumber).toString().split('');

  const DV = resultArrayDigit[resultArrayDigit.length - 1];

  return Number(DV);
};

module.exports = (req, res, next) => {
  const { typeableLine } = req.params;

  const invertedFields = getFields(typeableLine);

  const allDVs = getDVs(typeableLine);

  let validate = true;

  invertedFields.forEach((invertedFieldArray, index) => {
    const calculatedDV = calculationDVModuleTeen(invertedFieldArray);

    if (calculatedDV !== allDVs[index]) {
      validate = false;
    }
  });

  if (!validate) {
    return res.status(400).json({
      message: 'This typeable line has no valid digit verified'
    });
  }

  next();
};



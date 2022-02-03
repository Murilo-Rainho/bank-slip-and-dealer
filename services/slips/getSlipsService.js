const getDateFromDays = (DLArray) => {
  const baseDateTimeBC = new Date('1997-10-07').getTime();

  const dateTime = DLArray.slice(33, 37).join('');

  const oneDay = 86400000;

  const expirationDate = new Date(baseDateTimeBC + Number(dateTime) * oneDay);

  return expirationDate.toISOString().split('T')[0];
};

const getValue = (DLArray) => {
  // const currency = DLArray[3] === '9' ? 'Real' : 'Dólar';

  const value = Number(DLArray.slice(37, 49).join(''));

  const valueFloatFixed = `${(value / 100).toFixed(2)}`;

  return valueFloatFixed;
};

const barCodeBankSlip = (DLArray) => {
  const companyCode = `${DLArray.slice(0, 3).join('')}`;

  const currencyCode = `${DLArray[3]}`;

  const freeFieldOne = `${DLArray.slice(4, 9).join('')}`;

  const freeFieldTwo = `${DLArray.slice(10, 20).join('')}`;

  const freeFieldThree = `${DLArray.slice(21, 31).join('')}`;

  const barCodeDV = `${DLArray[32]}`;

  const expirationDate = `${DLArray.slice(33, 37).join('')}`;

  const value = `${DLArray.slice(37).join('')}`;

  const requiredField = `${companyCode}${currencyCode}${barCodeDV}${expirationDate}${value}`;
  
  const freeField = `${freeFieldOne}${freeFieldTwo}${freeFieldThree}`;

  return `${requiredField}${freeField}`;
};

const bankCodifier = (digitableLine) => {
  const DLArray = digitableLine.split('');

  const expirationDate = getDateFromDays(DLArray);

  const amount = getValue(DLArray);

  const barCode = barCodeBankSlip(DLArray);

  const objectResult = {
    amount,
    expirationDate,
    barCode,
  };

  return objectResult;
};

const validateDVBarCode = (barCode) => {
  const DVBarCode = Number(barCode[4]);

  const barCodeWithoutDV = `${barCode.slice(0, 4)}${barCode.slice(5)}`;

  const barCodeInverted = barCodeWithoutDV.split('').slice(0).reverse();

  let multiplier = 1;

  const summedNumbers = barCodeInverted.reduce((acc, curr) => {
    multiplier += 1;

    if (multiplier >= 10) multiplier = 2

    const product = multiplier * curr;

    return product + acc;
  }, 0);

  const restNumber = summedNumbers % 11;

  let validateDV = 11 - restNumber;

  if (validateDV === 0) validateDV = 1;
  if (validateDV == 10) validateDV = 1;
  if (validateDV == 11) validateDV = 1;

  const isValid = validateDV === DVBarCode ? true : false;

  return isValid;
};

module.exports = (digitableLine, typeableLineInfo) => {
  try {
    let objectServiceResponse = {};

    if (typeableLineInfo.type === 'bank') {
      objectServiceResponse = bankCodifier(digitableLine);      
    }

    const validate = validateDVBarCode(objectServiceResponse.barCode);

    if (!validate) {
      return { message: 'This typeable line has no valid bar code DV' };
    }

    return { data: objectServiceResponse };
  } catch (error) {
    throw new Error(error);
  }
};

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

module.exports = (digitableLine, typeableLineInfo) => {
  try {
    let objectServiceResponse = {};

    if (typeableLineInfo.type === 'bank') {
      objectServiceResponse = bankCodifier(digitableLine);      
    }

    return objectServiceResponse;
  } catch (error) {
    throw new Error(error);
  }
};

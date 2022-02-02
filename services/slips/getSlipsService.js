const getDateFromDays = (DLArray) => {
  const baseDateTimeBC = new Date('1997-10-07').getTime();

  const dateTime = DLArray.slice(33, 37).join('');

  const oneDay = 86400000;

  const expirationDate = new Date(baseDateTimeBC + Number(dateTime) * oneDay);

  return expirationDate.toISOString().split('T')[0];
};

const getValue = (DLArray) => {
  const currency = DLArray[3] === '9' ? 'Real' : 'Dólar';

  const value = Number(DLArray.slice(37, 49).join(''));

  const valueFloatFixed = `${(value / 100).toFixed(2)}`;

  const realToDolar = 5.30; // Representa a conversão de real para dólar e vice-versa

  const resultAmount = currency === 'Real' ? valueFloatFixed : valueFloatFixed * realToDolar;

  return resultAmount;
};

const bankCodifier = (digitableLine) => {
  const DLArray = digitableLine.split('');

  const expirationDate = getDateFromDays(DLArray);

  const amount = getValue(DLArray);

  const objectResult = {
    amount,
    expirationDate,
    barCode: digitableLine,
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
    throw new Error('Something went wrong');
  }
};

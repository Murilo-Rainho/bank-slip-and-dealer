// converte os números referentes à data de expiração da linha digitável para uma data. Ex: '2018-09-02'
const getDateFromDays = (dateTime) => {
  const baseDateTimeBC = new Date('1997-10-07').getTime(); // retorna o valor numérico correspondente ao horário dessa data, de acordo com o horário universal

  if (dateTime === 0) return 'This slip does not expire';

  const oneDay = 86400000; // um dia em milisegundos

  const expirationDate = new Date(baseDateTimeBC + dateTime * oneDay);

  return expirationDate.toISOString().split('T')[0]; // converte a string '1997-10-07T00:00:00.000Z' para '1997-10-07'
};

// pega o valor na linha digitável e o converte. Ex: 0000002000 --> '20.00'
const getValue = (value) => {
  if (value === 0) return '0.00';

  const valueFloatFixed = `${(value / 100).toFixed(2)}`;

  return valueFloatFixed;
};

// valida o dígito verificável do código de barras de um boleto bancário, de acordo
// com o documento "Especificações Técnicas para Confecção de Boleto de Cobrança do Banco do Brasil"
const validateDVBarCode = (barCodeWithoutDV, DVBarCode, slipType) => {
  // transforma a string de cima em array e inverte os itens, por conta da regra de negócio
  // do módulo 11 do anéxo V, do documento citado acima
  const barCodeInverted = barCodeWithoutDV.split('').slice(0).reverse();

  let multiplier = 1;

  // soma todos os números depois de multiplicá-los
  const summedNumbers = barCodeInverted.reduce((acc, curr) => {
    multiplier += 1; // para que ele soma +1 a cada "rodagem" do reduce, iniciando em 2

    // faz com que o multiplicador fique sempre entre 2 e 9
    if (multiplier >= 10) multiplier = 2

    const product = multiplier * curr;

    return product + acc;
  }, 0);

  let validateDV = summedNumbers % 11;

  if (slipType === 'bank') {
    validateDV = 11 - validateDV;
  
    if (validateDV === 0) validateDV = 1;
    if (validateDV == 10) validateDV = 1;
    if (validateDV == 11) validateDV = 1;
  }

  // se for válido, retornará "true", caso for inválido, retornará "false"
  const isValid = validateDV === DVBarCode ? true : false;

  return isValid;
};

// converte a linha digitável para um código de barras de um boleto bancário
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

// pega todos os valores que serão enviados numa 'response' de sucesso
const bankCodifier = (typeableLine) => {
  // transforma a string da linha digitável num array, contendo cada
  // algarismo da linha digitável em um índice do array, para ficar
  // mais fácil de manipular os dados
  const DLArray = typeableLine.split('');

  const dateTime = Number(DLArray.slice(33, 37).join(''));

  const expirationDate = getDateFromDays(dateTime);

  const value = Number(DLArray.slice(37, 49).join(''));

  const amount = getValue(value);

  const barCode = barCodeBankSlip(DLArray);

  return {
    amount,
    expirationDate,
    barCode,
  };
};

const barCodeDealerSlip = (DLArray) => {
  const fieldOne = `${DLArray.slice(0, 11).join('')}`;

  const fieldTwo = `${DLArray.slice(12, 23).join('')}`;

  const fieldThree = `${DLArray.slice(24, 35).join('')}`;

  const fieldFour = `${DLArray.slice(36, 47).join('')}`;

  return `${fieldOne}${fieldTwo}${fieldThree}${fieldFour}`;
};

const dealerCodifier = (typeableLine) => {
  // transforma a string da linha digitável num array, contendo cada
  // algarismo da linha digitável em um índice do array, para ficar
  // mais fácil de manipular os dados
  const DLArray = typeableLine.split('');

  // const dateTime = Number(DLArray.slice(33, 37).join(''));

  // const expirationDate = getDateFromDays(dateTime);

  // const value = Number(DLArray.slice(37, 49).join(''));

  // const amount = getValue(value);

  const barCode = barCodeDealerSlip(DLArray);

  return {
    // amount,
    // expirationDate,
    barCode,
  };
};

module.exports = (typeableLine = '', typeableLineInfo = {}) => {
  let objectServiceResponse = {};
  let validate; // para validar o DV do código de barras

  // para uma linha digitável de um boleto bancário, fará as devidas
  // validações e extrairá os valores necessários
  if (typeableLineInfo.type === 'bank') {
    objectServiceResponse = bankCodifier(typeableLine);

    const DVBarCode = Number(objectServiceResponse.barCode[4]);

    // retira o DV do código de barras
    const barCodeWithoutDV = `${objectServiceResponse.barCode.slice(0, 4)}${objectServiceResponse.barCode.slice(5)}`;

    validate = validateDVBarCode(barCodeWithoutDV, DVBarCode, typeableLineInfo.type);    
  }

  if (typeableLineInfo.type === 'dealer') {
    objectServiceResponse = dealerCodifier(typeableLine);

    const DVBarCode = Number(typeableLine[47]);

    const barCodeWithoutDV = typeableLine.split('').slice(0, 47).join('');

    validate = validateDVBarCode(barCodeWithoutDV, DVBarCode, typeableLineInfo.type);
  }

  if (!validate) {
    return { message: 'This typeable line has no valid bar code DV' };
  }

  return { data: objectServiceResponse };
};

// console.log('856900000584030100649158110347945609001374691358'.split('').slice(0, 47).join(''));

const getFieldsBankSlip = (typeableLine) => {
  const fieldOne = typeableLine.slice(0, 9).split(''); // cria um array com os dígitos do primeiro campo, sem o dígito verificador
  fieldOne.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  const fieldTwo = typeableLine.slice(10, 20).split(''); // cria um array com os dígitos do segundo campo, sem o dígito verificador
  fieldTwo.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  const fieldThree = typeableLine.slice(21, 31).split(''); // cria um array com os dígitos do terceiro campo, sem o dígito verificador
  fieldThree.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  return [fieldOne, fieldTwo, fieldThree];
};

const getDVsBankSlip = (typeableLine) => { // pega os dígitos verificadores dos campos 1, 2 e 3
  const dvOne = Number(typeableLine[9]);
  const dvTwo = Number(typeableLine[20]);
  const dvThree = Number(typeableLine[31]);

  return [dvOne, dvTwo, dvThree];
};

const getFieldsDealerSlip = (typeableLine) => {
  const fieldOne = typeableLine.slice(0, 11).split(''); // cria um array com os dígitos do primeiro campo, sem o dígito verificador
  fieldOne.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  const fieldTwo = typeableLine.slice(12, 23).split(''); // cria um array com os dígitos do segundo campo, sem o dígito verificador
  fieldTwo.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  const fieldThree = typeableLine.slice(24, 35).split(''); // cria um array com os dígitos do terceiro campo, sem o dígito verificador
  fieldThree.reverse(); // inverte o array, por conta da regra de negócio da multiplicação dos carácteres, da direita para a esquerda

  return [fieldOne, fieldTwo, fieldThree];
};

const getDVsDealerSlip = (typeableLine) => {
  const dvOne = Number(typeableLine[11]);
  const dvTwo = Number(typeableLine[23]);
  const dvThree = Number(typeableLine[35]);

  return [dvOne, dvTwo, dvThree];
};

// faz o cálculo para validar os dígitos verificadores dos campos 1, 2 e 3, de acordo com o módulo 10 do anéxo IV
// do documento "Especificações Técnicas para Confecção de Boleto de Cobrança do Banco do Brasil"
const calculationDVModuleTeen = (invertedFieldArray) => {
  const summedNumbers = invertedFieldArray.reduce((acc, curr, index) => {
    let multiplier = 1;

    // o multiplicador começa sendo 2 para o primeiro número do array,
    // para o próximo será 1, para o outro, 2, e assim sucessivamente
    if (index % 2 === 0) multiplier = 2; 

    let product = curr * multiplier;

    if (product >= 10) { // se a multiplicação tiver 2 dígitos
      // será convertida em um array de string, contendo cada algarismo em cada posição do array
      const productArray = product.toString().split('');

      // e será somado os algarismos. Ex: 18 = 1 + 8 = 9
      product = productArray.reduce((acc, curr) => Number(acc) + Number(curr));
    }

    return Number(product) + acc;
  }, 0);

  // arredonda a unidade para a dezena de cima
  const accurateTen = Math.ceil(summedNumbers / 10) * 10 // Ex: summedNumbers = 21, accurateTen = 30

  const restNumber = summedNumbers % 10;

  // transforma em array o resultado da subtração
  const resultArrayDigit = (accurateTen - restNumber).toString().split(''); // Ex: 30 - 6 = ['2', '4']

  const DV = resultArrayDigit[resultArrayDigit.length - 1]; // pega o último elemento do array. No exemplo de cima, seria o '4'

  return Number(DV);
};

module.exports = (req, res, next) => {
  const {
    params: { typeableLine },
    typeableLineInfo: { type },
  } = req;

  let invertedFields;
  let allDVs;

  if (type === 'bank') {
    invertedFields = getFieldsBankSlip(typeableLine);
  
    allDVs = getDVsBankSlip(typeableLine);
  }

  if (type === 'dealer') {
    invertedFields = getFieldsDealerSlip(typeableLine);
  
    allDVs = getDVsDealerSlip(typeableLine);
  }

  let validate = true;

  // vai verificar cada dígito verificador de cada campo (1, 2 e 3) e,
  // em caso de algum não for válido, cairá no case da linha 73, e, por consequência,
  // no case da linha 78, retornando um erro
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

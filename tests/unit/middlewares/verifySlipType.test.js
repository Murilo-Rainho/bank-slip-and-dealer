const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
let request = {};
let next = () => {};

describe('Verify what is the type of the slip.', () => {

  const { verifySlipType } = require('../../../services/middlewares');

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });

  after(() => {
    request = {};
  });
  
  describe('If the type is "dealer"', () => {

    before(() => {
      request.params = {
        typeableLine: '856900000584030100649158110347945609001374691358',
      };
    });

    it('the "next" has been called', () => {
      verifySlipType(request, response, next);

      expect(next).to.have.been.called;
    });

    it('a key named "typeableLineInfo" is added to request, with value "dealer"', () => {
      verifySlipType(request, response, next);

      expect(request.typeableLineInfo.type).to.deep.equal('dealer');
    });

  });

  describe('If the type is "bank"', () => {

    before(() => {
      request.params = {
        typeableLine: '21290001192110001210904475617405975870000002000',
      };
    });

    it('the "next" has been called', () => {
      verifySlipType(request, response, next);

      expect(next).to.have.been.called;
    });

    it('a key named "typeableLineInfo" is added to request, with value "bank"', () => {
      verifySlipType(request, response, next);

      expect(request.typeableLineInfo.type).to.deep.equal('bank');
    });

  });

  describe('If is an invalid typeable line', () => {

    before(() => {
      request.params = {
        typeableLine: '123',
      };
    });

    it('returns an object error with the key "message", with value "This typeable line is not valid"', () => {
      const mockErrorResponse = {
        message: 'This typeable line is not valid',
      };

      verifySlipType(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('the status http has called with the code "400"', () => {
      verifySlipType(request, response, next);
      
      expect(response.status.calledWith(400)).to.be.true;
    });

  });

});

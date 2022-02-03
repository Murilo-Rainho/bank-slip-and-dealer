const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
let request = {};
let next = () => {};

describe('Verify all character of typeable line.', () => {

  const { verifyIsAllNumber } = require('../../../services/middlewares');

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });

  after(() => {
    request = {};
  });

  describe('If it\'s all number"', () => {

    before(() => {
      request.params = {
        typeableLine: '21290001192110001210904475617405975870000002000',
      };
    });

    it('the "next" function has been called', () => {
      verifyIsAllNumber(request, response, next);

      expect(next).to.have.been.called;
    });

  });

  describe('If it\'s not all number', () => {

    before(() => {
      request.params = {
        typeableLine: '212900011921100012109044756174^5975870000002000',
      };
    });

    it('return the error object', () => {
      const mockErrorResponse = {
        message: 'The typeable line should be made up of numbers only'
      };

      verifyIsAllNumber(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('the status http has called with the code "400"', () => {
      verifyIsAllNumber(request, response, next);
      
      expect(response.status.calledWith(400)).to.be.true;
    });

  });

});

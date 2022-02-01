const { expect } = require('chai');

const { stub } = require('sinon');

const response = {};
const request = {};
let next = () => {};

const throwError = new Error('something went wrong');

describe('Verify what is the type of the slip.', () => {

  const { verifySlipType } = require('../../../services/middlewares');

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });
  
  describe('If the type is "dealer"', () => {
    
    request.params = {
      digitableLine: '846100000005246100291102005460339004695895061080',
    };

    const mockResponse = {
      digitableLineLength: 48,
      type: 'dealer'
    };

    it('don\'t return the error object', () => {
      verifySlipType(request, response, next);

      // try to test request parameter
      expect(response.json.calledWith(mockResponse)).to.be.false;
    });

  });

  describe('If the type is "bank"', () => {
    
    request.params = {
      digitableLine: '21290001192110001210904475617405975870000002000',
    };

    const mockResponse = {
      digitableLineLength: 47,
      type: 'bank'
    };

    it('don\'t return the error object', () => {
      verifySlipType(request, response, next);

      expect(response.json.calledWith(mockResponse)).to.be.false;
    });

  });

  describe('If is an invalid digitable line', () => {
    
    request.params = {
      digitableLine: '123',
    };

    const mockResponse = {
      message: 'This digitable line is not valid',
    };

    it('returns an object error with the key "message", with value "This digitable line is not valid"', () => {
      verifySlipType(request, response, next);

      expect(response.json.calledWith(mockResponse)).to.be.true;
    });

  });

});

const { expect } = require('chai');

const { stub } = require('sinon');

const mockResponse = {};
const mockRequest = {};
let next = () => {};

const throwError = new Error('something went wrong');

describe('Verify what is the type of the slip.', () => {

  const { verifySlipType } = require('../../services/middlewares');

  before(() => {
    mockResponse.status = stub().returns(mockResponse);
    mockResponse.json = stub().returns();
    next = stub().returns();
  });
  
  describe('If the type is "dealer"', () => {
    
    mockRequest.params = {
      digitableLine: '846100000005246100291102005460339004695895061080',
    };

    it('returns an object with the key "digitableLineLength", with value "48"', () => {
      const response =  verifySlipType(mockRequest, mockResponse, next);

      expect(response.digitableLineLength).to.be.equal(48);
    });
    
    it('returns an object with the key "type", with value "dealer"', () => {
      const response =  verifySlipType(mockRequest, mockResponse, next);

      expect(response.type).to.be.equal('dealer');
    });

  });

  describe('If the type is "bank"', () => {
    
    mockRequest.params = {
      digitableLine: '21290001192110001210904475617405975870000002000',
    };

    it('returns an object with the key "digitableLineLength", with value "47"', () => {
      const response =  verifySlipType(mockRequest, mockResponse, next);

      expect(response.digitableLineLength).to.be.equal(48);
    });
    
    it('returns an object with the key "type", with value "bank"', () => {
      const response =  verifySlipType(mockRequest, mockResponse, next);

      expect(response.type).to.be.equal('bank');
    });

  });

  describe('If is a invalid digitable line', () => {
    
    mockRequest.params = {
      digitableLine: '123',
    };

    it('returns an object error with the key "message", with value "This digitable line is not valid"', () => {
      const response =  verifySlipType(mockRequest, mockResponse, next);

      expect(response.message).to.be.equal('This digitable line is not valid');
    });

  });

});

const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
const request = {};
let next = () => {};

const throwError = new Error('something went wrong');

describe('Verify all character of typeable line.', () => {

  const { verifyIsAllNumber } = require('../../../services/middlewares');

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });
  
  const mockErrorResponse = {
    message: 'The typeable line should be made up of numbers only'
  };

  describe('If it\'s all number"', () => {
    
    request.params = {
      typeableLine: '846100000005246100291102005460339004695895061080',
    };


    it('don\'t return the error object', () => {
      verifyIsAllNumber(request, response, next);

      expect(next).to.have.been.called;
    });

  });

  describe('If it\'s not all number', () => {
    
    request.params = {
      typeableLine: '212900011a2110001210904#75617405975870^00002000',
    };

    it('return the error object', () => {
      verifyIsAllNumber(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

  });

});

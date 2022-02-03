const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
let request = {};
let next = () => {};

const throwError = new Error('something went wrong');

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

  const mockErrorResponse = {
    message: 'This typeable line is not valid',
  };
  
  // describe('If the type is "dealer"', () => {
    
  //   request.params = {
  //     typeableLine: '846100000005246100291102005460339004695895061080',
  //   };

  //   it('don\'t return the error object', () => {
  //     verifySlipType(request, response, next);

  //     expect(next).to.have.been.called;
  //   });

  // });

  describe.only('If the type is "bank"', () => {
    
    request.params = {
      typeableLine: '21290001192110001210904475617405975870000002000',
    };

    it('don\'t return the error object', () => {
      verifySlipType(request, response, next);

      console.log('1', request);

      expect(next).to.have.been.called;
    });

  });

  // describe('If is an invalid typeable line', () => {
    
  //   request.params = {
  //     typeableLine: '123',
  //   };

  //   it('returns an object error with the key "message", with value "This typeable line is not valid"', () => {
  //     verifySlipType(request, response, next);

  //     console.log('2', request);

  //     expect(response.json.calledWith(mockErrorResponse)).to.be.true;
  //   });

  // });

});

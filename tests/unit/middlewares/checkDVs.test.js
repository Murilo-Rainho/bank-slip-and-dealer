const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
let request = {};
let next = () => {};

describe('verify each of DVs (digit verifier)', () => {
  
  const { checkDVs } = require('../../../services/middlewares');

  const mockErrorResponse = {
    message: 'This typeable line has no valid digit verified'
  };

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });

  after(() => {
    request = {};
  });

  describe('if has a invalid DV in the first field', () => {
    
    before(() => {
      request.params = {
        typeableLine: '21290001172110001210904475617405975870000002000',
      };
    });

    it('return a object error with key message: "This typeable line has no valid digit verified"', () => {
      checkDVs(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('return a http status code "400"', () => {
      checkDVs(request, response, next);

      expect(response.status.calledWith(400)).to.be.true;
    });

  });

  describe('if has a invalid DV in the second field', () => {
    
    before(() => {
      request.params = {
        typeableLine: '21290001192110001210704475617405975870000002000',
      };
    });

    it('return a object error with key message: "This typeable line has no valid digit verified"', () => {
      checkDVs(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('return a http status code "400"', () => {
      checkDVs(request, response, next);

      expect(response.status.calledWith(400)).to.be.true;
    });

  });

  describe('if has a invalid DV in the third field', () => {
    
    before(() => {
      request.params = {
        typeableLine: '21290001192110001210704475617401975870000002000',
      };
    });

    it('return a object error with key message: "This typeable line has no valid digit verified"', () => {
      checkDVs(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('return a http status code "400"', () => {
      checkDVs(request, response, next);

      expect(response.status.calledWith(400)).to.be.true;
    });

  });

  describe('if has no invalid DV', () => {
    
    before(() => {
      request.params = {
        typeableLine: '21290001192110001210904475617405975870000002000',
      };
    });

    it('the "next" function has been called', () => {
      checkDVs(request, response, next);

      expect(response.json.calledWith(mockErrorResponse)).to.be.true;
    });

    it('return a http status code "400"', () => {
      checkDVs(request, response, next);

      expect(next).to.have.been.called;
    });

  });
  
});

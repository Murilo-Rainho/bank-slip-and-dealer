const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const err = { message: 'Something went wrong' };
const response = {};
let request = {};
let next = () => {};

describe('The error handler', () => {

  const { errorHandler } = require('../../../services/middlewares');

  const mockErrorResponse = {
    message: err.message,
    err,
  };
  
  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    stub(console, 'log').returns();
  });

  after(() => {
    request = {};
    console.log.restore();
  });

  it('return the response object, with keys "err" and "message"', () => {
    errorHandler(err, request, response, next);

    expect(response.json.calledWith(mockErrorResponse)).to.be.true;
  });

  it('return the http status code "500"', () => {
    errorHandler(err, request, response, next);

    expect(response.status.calledWith(500)).to.be.true;
  });

  it('has a console.log with the error handled', () => {
    errorHandler(err, request, response, next);

    expect(console.log.calledWith(err)).to.be.true;
  });

});

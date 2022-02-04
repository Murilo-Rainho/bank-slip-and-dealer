const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const { stub } = require('sinon');

const response = {};
let request = {};
let next = () => {};

describe('verify getSlipsController', () => {

  const { getSlipsController } = require('../../../controllers/slips');
  const services = require('../../../services/slips');

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });

  after(() => {
    request = {};
  });
  
  describe('if has success', () => {

    const mockResponseSuccess = {
      data: {
        amount: '580.30',
        expirationDate: '2000-07-09',
        barCode: '85690000058030100649151103479456000137469135',
      },
    };

    before(() => {
      stub(services, 'getSlipsService').returns(mockResponseSuccess);
    });

    after(() => {
      services.getSlipsService.restore();
    });

    request.params = { typeableLine: '856900000584030100649158110347945609001374691358' };

    request.typeableLineInfo = { type: 'dealer' };
    
    it('return an object with keys "amount", "barCode" and "expirationDate"', () => {
      getSlipsController(request, response, next);

      expect(response.json.calledWith(mockResponseSuccess.data)).to.be.true;
    });

    it('return http status "200"', () => {
      getSlipsController(request, response, next);

      expect(response.status.calledWith(200)).to.be.true;
    });

  });

  describe('if has fail', () => {

    const mockResponseFail = {
      message: 'Something went wrong',
    };

    before(() => {
      stub(services, 'getSlipsService').returns(mockResponseFail);
    });

    after(() => {
      services.getSlipsService.restore();
    });

    request.params = { typeableLine: '856900000584030100649158110347945609001374691358' };

    request.typeableLineInfo = { type: 'dealer' };
    
    it('return an error object with message\'s error', () => {
      getSlipsController(request, response, next);

      expect(response.json.calledWith(mockResponseFail)).to.be.true;
    });

    it('return http status "400"', () => {
      getSlipsController(request, response, next);

      expect(response.status.calledWith(400)).to.be.true;
    });

  });

});

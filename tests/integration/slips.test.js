const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../../server');

chai.use(chaiHttp);

describe('Bank slips', () => {
  
  describe('when has a valid typeable line', () => {
    
    it('should GET a slip object according to the pattern', (done) => {
      chai.request(server)
        .get('/boletos')
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('barCode');
          res.body.should.have.property('amount');
          res.body.should.have.property('expirationDate');
          done();
        });
    });

  });

  describe('when has a invalid typeable line', () => {
    
    it('should GET a error object according to the pattern', (done) => {
      chai.request(server)
        .get('/boletos')
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
    
  });

});


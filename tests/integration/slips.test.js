const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../server');

chai.use(chaiHttp);

describe('Bank slips', () => {
  
  describe('when has a valid typeable line', () => {
    
    it('should GET a slip object according to the pattern', (done) => {
      chai.request(server)
        .get('/boleto/21290001192110001210904475617405975870000002000')
        .end((_err, res) => {
          chai.expect(res).have.status(200);
          chai.expect(res.body).be.a('object');
          chai.expect(res.body).have.property('barCode').eql('21299758700000020000001121100012100447561740');
          chai.expect(res.body).have.property('amount').eql('20.00');
          chai.expect(res.body).have.property('expirationDate').eql('2018-07-16');
          done();
        });
    });

  });

  describe('when has a invalid typeable line', () => {
    
    it('should GET a error object according to the pattern', (done) => {
      chai.request(server)
        .get('/boleto/123')
        .end((_err, res) => {
          chai.expect(res).have.status(400);
          chai.expect(res.body).have.property('message').eql('This typeable line is not valid');
          done();
        });
    });
    
  });

});

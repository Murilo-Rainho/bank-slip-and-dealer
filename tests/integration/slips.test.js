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

    describe('with length different to 48 or 47', () => {
      
      it('should return a error object with message "This typeable line is not valid"', (done) => {
        chai.request(server)
          .get('/boleto/123')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('This typeable line is not valid');
            done();
          });
      });

    });
    
    describe('with a bar code DV invalid', () => {
      
      it('should return a error object with message "This typeable line has no valid bar code DV"', (done) => {
        chai.request(server)
          .get('/boleto/21290001192110001210904475617405875870000002000')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('This typeable line has no valid bar code DV');
            done();
          });
      });

    });

    describe('with any character that is not a number', () => {
      
      it('should return a error object with message "The typeable line should be made up of numbers only"', (done) => {
        chai.request(server)
          .get('/boleto/212900011921100012109044756^7405975870000002000')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('The typeable line should be made up of numbers only');
            done();
          });
      });

    });

    describe('that should return a error object', () => {
      
      it('if the invalid DV is in field One', (done) => {
        chai.request(server)
          .get('/boleto/21290001172110001210904475617405975870000002000')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('This typeable line has no valid digit verified');
            done();
          });
      });

      it('if the invalid DV is in field Two', (done) => {
        chai.request(server)
          .get('/boleto/21290001192110001210704475617405975870000002000')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('This typeable line has no valid digit verified');
            done();
          });
      });

      it('if the invalid DV is in field Three', (done) => {
        chai.request(server)
          .get('/boleto/21290001192110001210704475617401975870000002000')
          .end((_err, res) => {
            chai.expect(res).have.status(400);
            chai.expect(res.body).have.property('message').eql('This typeable line has no valid digit verified');
            done();
          });
      });

    });

  });

});

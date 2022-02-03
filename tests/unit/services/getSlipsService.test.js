const { expect } = require('chai');

describe('If getSlipsService', () => {
  
  const { getSlipsService } = require('../../../services/slips');

  describe('receive a valid typeable line of type "bank"', () => {

    const typeableLine = '21290001192110001210904475617405975870000002000';
    const typeableLineInfo = { type: 'bank' }; 

    const mockResult = {
      data: {
        amount: '20.00',
        expirationDate: '2018-07-16',
        barCode: '21299758700000020000001121100012100447561740'
      },
    };
    
    it('return a object with a key "data" that has keys "amount", "expirationDate" and "barCode"', () => {
      const serviceResult = getSlipsService(typeableLine, typeableLineInfo);

      expect(serviceResult).to.have.own.property('data');
      expect(serviceResult.data).to.have.own.property('amount');
      expect(serviceResult.data).to.have.own.property('expirationDate');
      expect(serviceResult.data).to.have.own.property('barCode');
    });

    it('return a object with a key "data" that has the correct values', () => {
      const serviceResult = getSlipsService(typeableLine, typeableLineInfo);

      expect(serviceResult).to.deep.equal(mockResult);
    });
    
  });

  describe('receive an invalid typeable line', () => {

    const typeableLineInfo = { type: 'bank' };

    const mockResult = {
      message: 'This typeable line has no valid bar code DV',
    };

    describe('without second param (typeableLineInfo)', () => {

      const typeableLine = '21290001192110001210904475617405975870000002000';

      it('return an error object with the correct key "message"', () => {
        const serviceResult = getSlipsService(typeableLine);
  
        expect(serviceResult).to.deep.equal(mockResult);
      });

    });
    
    describe('that has a invalid bar code DV', () => {
      
      const typeableLine = '21290001192110001210904475617405875870000002000';

      it('return an error object with the correct key "message"', () => {
        const serviceResult = getSlipsService(typeableLine, typeableLineInfo);
  
        expect(serviceResult).to.deep.equal(mockResult);
      });
      
    });
        
  });
  
});

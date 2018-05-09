import bindActionCreators from '../src/utils/bindActionCreators';
import sinon from 'sinon';
import { expect } from 'chai';

describe('bindActionCreators', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = sinon.spy();
  });
  afterEach(() => {
    dispatch.reset();
  });
  describe('When a Function is passed', () => {
    it('should return an inner function wrapping dispatch and AC', () => {
      const actionCreator = function (payload) {
        return {
          type: 'FAKE_ACTION',
          payload
        }
      }

      const boundedActionCreator = bindActionCreators(actionCreator, dispatch);

      expect(boundedActionCreator).to.be.a('function');

      boundedActionCreator('somepayload');
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.calledWith({ type: 'FAKE_ACTION', payload: 'somepayload' })).to.be.true;
    });
  })

  describe('When an invalid type is provided as action creator', () => {
    it('should throw an error if an object has been given', () => {
      const actionCreator = 'actionCreator';
      expect(() => bindActionCreators(actionCreator, dispatch))
        .to.throw('[revux] - bindActionCreators expects an object or a function.');
    });
  });

  describe('When an Object is passed', () => {
    it('should return an inner object of wrapping dispatch action creators', () => {
      const aCs = {
        login: sinon.stub().returns({ type: 'LOGIN' }),
        signIn: sinon.stub().returns({ type: 'SIGNIN' })
      }

      const BoundedACs = bindActionCreators(aCs, dispatch);

      expect(BoundedACs).to.be.an('Object');
      expect(Object.keys(BoundedACs)).to.deep.equal(Object.keys(aCs));

      for (let actionName in BoundedACs) {
        BoundedACs[actionName]();
      }

      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.calledWith({ type: 'LOGIN' })).to.be.true;
      expect(dispatch.secondCall.calledWith({ type: 'SIGNIN' })).to.be.true;
    });

    it('should ignores invalid actionCreator', () => {
      const aCs = {
        invalidAction: 'string',
        validAction: sinon.stub()
      }

      const BoundedACs = bindActionCreators(aCs, dispatch);


      expect(BoundedACs).to.be.an('Object');
      expect(Object.keys(BoundedACs)).to.deep.equal(['validAction']);

      for (let actionName in BoundedACs) {
        BoundedACs[actionName]();
      }

      expect(dispatch.calledOnce).to.be.true;
    });
  });
});

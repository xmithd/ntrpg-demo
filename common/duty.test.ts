import { validateDuty } from './duty';

describe('The duty validation function', () => {
  it('returns false when object is undefined', () => {
    expect(validateDuty(undefined)).toBeFalsy();
  })

  it('returns false if object is missing attributes', () => {
    expect(validateDuty({id: 'ok'})).toBeFalsy();
    expect(validateDuty({name: 'ok'})).toBeFalsy();
    expect(validateDuty({id: '', name: 'ok'})).toBeFalsy();
    expect(validateDuty({id: '123', name: ''})).toBeFalsy();
  });

  it('returns false if object attributes are too large', () => {
    const tooLong = Array(256).fill('a').join('');
    expect(validateDuty({id: 'ok', name: tooLong})).toBeFalsy();
    expect(validateDuty({id: tooLong, name: 'ok'})).toBeFalsy();
    expect(validateDuty({id: tooLong, name: tooLong})).toBeFalsy();
  });

  it('returns true if object is valid', () => {
    expect(validateDuty({id: '1234', name: 'some name'})).toBeTruthy();
  });

})

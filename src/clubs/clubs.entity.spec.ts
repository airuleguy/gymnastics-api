import { Club } from './clubs.entity';

describe('Clubs', () => {
  it('should be defined', () => {
    expect(new Club()).toBeDefined();
  });
});

import { expect } from 'chai';
import { add } from '../lib/people.js';

describe('People Functions', () => {
  describe('add', () => {
    it('should add a new person', async () => {
      const person = { name: 'Gonzo', email: 'gonzo@example.com', notes: 'Muppet' };
      const result = await add(new URL('http://localhost/api/people'), 'PUT', person);
      expect(result).to.have.property('id');
      expect(result.name).to.equal('Gonzo');
      expect(result.email).to.equal('gonzo@example.com');
      expect(result.notes).to.equal('Muppet');
    });

    it('should update an existing person', async () => {
      const person = { id: 1, name: 'Kermit Updated', email: 'kermit@new.com', notes: 'Updated' };
      const result = await add(new URL('http://localhost/api/people'), 'PUT', person);
      expect(result.id).to.equal(1);
      expect(result.name).to.equal('Kermit Updated');
      expect(result.email).to.equal('kermit@new.com');
      expect(result.notes).to.equal('Updated');
    });
  });
});
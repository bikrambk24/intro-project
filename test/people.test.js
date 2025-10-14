
import { expect } from 'chai';
import { add, get } from '../lib/people.js';

describe('People Functions', () => {
  describe('add', () => {
    it('should add a new person', async () => {
      const person = {
        name: 'Test Person',
        email: 'test@example.com',
        notes: 'Test notes'
      };
      const result = await add(person);
      expect(result).to.have.property('id');
      expect(result.name).to.equal('Test Person');
      expect(result.email).to.equal('test@example.com');
      expect(result.notes).to.equal('Test notes');

      const people = await get();
      expect(people).to.be.an('array');
      expect(people.some(p => p.id === result.id && p.name === 'Test Person')).to.be.true;
    });

    it('should update an existing person', async () => {
      
      const person = {
        name: 'Original Person',
        email: 'original@example.com',
        notes: 'Original notes'
      };
      const added = await add(person);

      const updatedPerson = {
        id: added.id,
        name: 'Updated Person',
        email: 'updated@example.com',
        notes: 'Updated notes'
      };
      const result = await add(updatedPerson);
      expect(result.id).to.equal(added.id);
      expect(result.name).to.equal('Updated Person');
      expect(result.email).to.equal('updated@example.com');
      expect(result.notes).to.equal('Updated notes');

      const people = await get();
      const updated = people.find(p => p.id === added.id);
      expect(updated.name).to.equal('Updated Person');
      expect(updated.email).to.equal('updated@example.com');
      expect(updated.notes).to.equal('Updated notes');
    });
  });

  describe('get', () => {
    it('should return all people', async () => {
      const people = await get();
      expect(people).to.be.an('array');
    });
  });
});
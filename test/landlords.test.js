import { expect } from 'chai';
import { add, get } from '../lib/landlords.js';

describe('Landlords Functions', () => {
  describe('add', () => {
    it('should add a new landlord', async () => {
      const landlord = {
        name: 'Test Landlord',
        email: 'landlord@example.com',
        notes: 'Test notes'
      };
      const result = await add(landlord);
      expect(result).to.have.property('id');
      expect(result.name).to.equal('Test Landlord');
      expect(result.email).to.equal('landlord@example.com');
      expect(result.notes).to.equal('Test notes');

      const landlords = await get();
      expect(landlords).to.be.an('array');
      expect(landlords.some(l => l.id === result.id && l.name === 'Test Landlord')).to.be.true;
    });

    it('should update an existing landlord', async () => {
      const landlord = {
        name: 'Original Landlord',
        email: 'original@example.com',
        notes: 'Original notes'
      };
      const added = await add(landlord);

      const updatedLandlord = {
        id: added.id,
        name: 'Updated Landlord',
        email: 'updated@example.com',
        notes: 'Updated notes'
      };
      const result = await add(updatedLandlord);
      expect(result.id).to.equal(added.id);
      expect(result.name).to.equal('Updated Landlord');
      expect(result.email).to.equal('updated@example.com');
      expect(result.notes).to.equal('Updated notes');

      const landlords = await get();
      const updated = landlords.find(l => l.id === added.id);
      expect(updated.name).to.equal('Updated Landlord');
      expect(updated.email).to.equal('updated@example.com');
      expect(updated.notes).to.equal('Updated notes');
    });
  });

  describe('get', () => {
    it('should return all landlords', async () => {
      const landlords = await get();
      expect(landlords).to.be.an('array');
    });
  });
});
import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
    boardingTreatmentText: computed('intake.length', function() {
        return `Intake/Boarding/Treatment (${this.get('intake.length')})`;
    }),

    fosteredText: computed('fostered.length', function() {
        return `Fostered (${this.get('fostered.length')})`;
    }),

    pendingAdoptionText: computed('pendingAdoption.length', function() {
        return `Pending Adoption (${this.get('pendingAdoption.length')})`;
    }),

    adoptedText: computed('adopted.length', function() {
        return `Adopted in 2022 (${this.get('adopted.length')})`;
    }),

    noMicrochips: computed('allDogs.[]', function() {
        const allDogs = this.allDogs;

        return allDogs.filter((dog) => {
            return (dog.get('microchipRegistered') === 'No' || !dog.get('microchip_id')) && dog.get('name') !== 'Foster';
        });
    }),

    noSpayNeuter: computed('allDogs.[]', function() {
        const allDogs = this.allDogs;

        return allDogs.filter((dog) => {
            const  spayNeuter = dog.get('spayNeuter')
            return (spayNeuter === 'Unknown' || spayNeuter === 'No - needs to be scheduled') && dog.get('name') !== 'Foster';
        });
    }),

    allDogs: computed('intake.[]', 'pendingAdoption.[]', 'fostered.[]', 'adopted.[]', function() {
        return [...this.intake.toArray(), ...this.fostered, ...this.pendingAdoption, ...this.adopted];
    }),
});

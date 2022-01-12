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
});

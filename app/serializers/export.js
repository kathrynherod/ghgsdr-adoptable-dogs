import DS from 'ember-data';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default DS.JSONSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        images: { embedded: 'always' },
        pet_attributes: { embedded: 'always' },
    },

    modelNameFromPayloadKey() {
        return `export`;
    },

    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const newPayload = payload.collection;
        newPayload[0].meta = payload.pagination;

        return this._super(store, primaryModelClass, newPayload, id, requestType)
    },

    normalize(modelClass, resourceHash) {
        const modifiedHash = resourceHash;
        const hwStat = modifiedHash.pet_attributes.find((attr) => attr.name === 'Heartworm Status');
        const hwTreatmentDate = modifiedHash.pet_attributes.find((attr) => attr.name === 'HW Treatment Start Date');

        const hadHW = hwStat.value === 'Positive' || hwStat.value === 'Treated';
        modifiedHash.hw_status = hwStat.value;
        modifiedHash.hw_treatment_date = hadHW ?
                hwTreatmentDate && hwTreatmentDate.value ?
                    hwTreatmentDate.value : 'need date' :
                null;
        modifiedHash.current_location = modifiedHash.current_location && modifiedHash.current_location.indexOf(',') ?
            modifiedHash.current_location.split(',')[0] : `!!Update Petstablished with Pet's Location`;

        if (modifiedHash.numerical_age === 'N/A') {
            modifiedHash.numerical_age = `!!Update Petstablished with Pet's DOB`;
        }
        if (resourceHash.status === 'Adopted') {
            modifiedHash.days_in_rescue = Math.floor((new Date(modifiedHash.app_adoption_date) - new Date(modifiedHash.date_aquired)) / (60*60*24*1000));
        } else {
            modifiedHash.days_in_rescue = Math.floor((new Date() - new Date(modifiedHash.date_aquired)) / (60*60*24*1000));
        }

        if (resourceHash.status === 'Boarding' || resourceHash.status === 'Treatment' || resourceHash.status === 'Intake') {
            let toFosterDate = new Date();

            if (hadHW) {
                const date = new Date(modifiedHash.hw_treatment_date);
                date.setDate(date.getDate() + 30);

                toFosterDate = date;
            }

            modifiedHash.to_foster_date  = toFosterDate.toUTCString();
        }

        return this._super(modelClass, modifiedHash);
    },
});

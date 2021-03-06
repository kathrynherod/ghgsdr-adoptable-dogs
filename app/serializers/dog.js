import DS from 'ember-data';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default DS.JSONSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        images: { embedded: 'always' },
        pet_attributes: { embedded: 'always' },
    },

    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const dogs = payload.collection;

        return this._super(store, primaryModelClass, dogs, id, requestType)
    },

    normalize(typeClass, hash) {
        const modifiedHash = hash;

        modifiedHash.description = modifiedHash.description.match(/<p>.*?<\/p>/g) ||
            ["I don't have a bio yet, but keep checking back for more details about me!"];

        modifiedHash.pet_attributes.push({
            name: 'Sex',
            value: modifiedHash.sex,
        });
        modifiedHash.pet_attributes.push({
            name: 'Weight',
            value: modifiedHash.weight,
        });

        modifiedHash.pet_attributes = modifiedHash.pet_attributes.map((attr) => {
            const modifiedAttr = attr;
            let icon;
            let index;

            switch (attr.name) {
                case 'Sex': {
                    attr.id = 0;
                    index = 0;
                    break;
                }
                case 'Age': {
                    index = 1;
                    break;
                }
                case 'Weight': {
                    attr.id = 2;
                    index = 2;
                    break;
                }
                case 'Spayed/Neutered': {
                    index = 3;
                    break;
                }
                case 'Heartworm Status': {
                    index = 4;
                    break;
                }
                case 'Good with Kids': {
                    modifiedHash.goodWithKids = attr.value;
                    icon = 'child'
                    index = 5;
                    break;
                }
                case 'Good with Big Dogs': {
                    modifiedHash.goodWithBigDogs = attr.value;
                    icon = 'dog'
                    index = 6;
                    break;
                }
                case 'Good with Small Dogs': {
                    modifiedHash.goodWithSmallDogs = attr.value;
                    icon = 'dog'
                    index = 7;
                    break;
                }
                case 'Good with Cats': {
                    modifiedHash.goodWithCats = attr.value;
                    icon = 'cat'
                    index = 8;
                    break;
                }
                case 'House Trained': {
                    index = 9;
                    break;
                }
                case 'Adoption Status': {
                    modifiedHash.adoptionStatus = attr.value;
                    icon = 'check'
                    index = 10;

                    break;
                }
                case 'Location': {
                    modifiedAttr.value = attr.value ? attr.value : 'Houston'
                    index = 11;
                    break;
                }
            }

            modifiedAttr.icon = icon;
            modifiedAttr.id = `${attr.id}-${hash.id}`;
            modifiedAttr.index = index;

            return modifiedAttr;
        }).sortBy('index');

        return this._super(typeClass, modifiedHash)
    },
});

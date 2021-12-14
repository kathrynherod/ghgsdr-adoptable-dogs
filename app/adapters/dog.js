import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
    proxy: 'https://hidden-bayou-45203.herokuapp.com/',

    host: computed(function() {
        const psUrl = 'https://petstablished.com/api/v2/public/pets?public_key=43eb4fe251a66bbdb3042ec3dcddb7c7';
        const queryParams = encodeURI(`&search[status]=Fostered,Fostered - Pending Adoption,Pending Adoption&pagination[limit]=50`);

        return `${this.proxy}${psUrl}${queryParams}`;
    }),

    pathForType(){
        return '';
    },
});

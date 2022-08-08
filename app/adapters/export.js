import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
    proxy: 'https://hidden-bayou-45203.herokuapp.com/',

    host: computed(function() {
        const psUrl = 'https://petstablished.com/api/v2/public/pets?public_key=43eb4fe251a66bbdb3042ec3dcddb7c7';

        return `${this.proxy}${psUrl}`;
    }),

    urlForQuery (query) {
        let queryParams;
        let limit;
        let page = query.page || 1;

        if (query.type === 'intake') {
            queryParams = '&search[status]=Intake,Treatment,Boarding';

        } else if (query.type === 'fostered') {
            limit = 100;
            queryParams = '&search[status]=Fostered,Fostered - Pending Adoption,Pending Adoption,Foster to Adopt, Fostered - Hold';

        } else if (query.type === 'adopted') {
            queryParams = `&search[status]=Adopted&sort[order]=desc&pagination[page]=${page}`
            limit = 125;
        }

        queryParams = encodeURI(`${queryParams}&pagination[limit]=${limit}`);

        return `${this.host}${queryParams}`;
    },

    pathForType(){
        return '';
    },
});

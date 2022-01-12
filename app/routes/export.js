import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import $ from 'jquery';

export default Route.extend({
    store: service(),

    model() {
        const controller = this.controllerFor('index');

        controller.set('loading', true);

        return hash({
            intake: this.store.query('export', { type: 'intake'}),
            fostered: this.store.query('export', { type: 'fostered'}),
            adopted: this.store.query('export', { type: 'adopted', page: 2 }),
        });
    },

    afterModel() {
        $(document).attr('title', `Dog Stats - GHGSDR`);
        const controller = this.controllerFor('index');

        $("#initialPageLoading").remove();
        controller.set('loading', false);
    },

    setupController(controller, model) {
        const fostered = [];
        const pendingAdoption = [];
        const fosterStatuses = ['Fostered', 'Foster to Adopt', 'Fostered - Hold'];

        model.fostered.forEach((dog) => {
            if (fosterStatuses.some((status) =>  status === dog.get('status'))) {
                fostered.push(dog);
            } else {
                pendingAdoption.push(dog);
            }
        })
        controller.setProperties({
            pendingAdoption,
            intake: model.intake,
            fostered,
            adopted: model.adopted.filter((dog) => {
                return dog.get('app_adoption_date').getUTCFullYear() === 2022
            }).sortBy('app_adoption_date').reverse(),
        });
    },
});

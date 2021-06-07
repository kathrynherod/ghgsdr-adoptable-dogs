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
            adopted: this.store.query('export', { type: 'adopted'}),
        });
    },

    afterModel() {
        $(document).attr('title', `Dog Stats - GHGSDR`);
        const controller = this.controllerFor('index');

        $("#initialPageLoading").remove();
        controller.set('loading', false);
    },

    setupController(controller, model) {
        controller.setProperties({
            pendingAdoption: model.fostered.filterBy('status', 'Pending Adoption'),
            intake: model.intake,
            fostered: model.fostered.filter((dog) => {
                const status = dog.get('status');

                return status === 'Fostered' || status === 'Foster to Adopt' || status === 'Fostered - Hold'
            }),
            adopted: model.adopted.filter((dog) => {
                return dog.get('app_adoption_date').getUTCFullYear() === 2021
            }).sortBy('app_adoption_date').reverse(),
        });
    },
});

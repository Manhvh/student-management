import LoadingDirective from 'directives/loading';

export default {
    install: (Vue) => {
        Vue.directive('loading', LoadingDirective);

        Vue.mixin({
            data: () => ({
                /**
                 * Show loading when ajax requesting
                 */
                showLoading: false,
            }),
        });

        /**
         * Start page loading.
         */
        Vue.prototype.$startLoading = function $startLoading() {
            this.$root.showLoading = true;
        };

        /**
         * Stop page loading.
         */
        Vue.prototype.$stopLoading = function $stopLoading() {
            this.$root.showLoading = false;
        };
    },
};

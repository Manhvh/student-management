import Vue from 'vue';
import $ from 'jquery';

/**
 * Apply function page ready.
 * @param {Function} initFunction
 */
export function applyInit(initFunction) {
    if (typeof initFunction !== 'undefined') {
        initFunction();
    }
}

/**
 * Apply function page ready.
 * @param {Function} readyFunction
 */
export function applyReady(readyFunction) {
    if (typeof readyFunction !== 'undefined') {
        $(readyFunction);
    }
}

/**
 * Apply function page loaded success.
 * @param {Function} loadedFunction
 */
export function applyLoaded(loadedFunction) {
    if (typeof loadedFunction !== 'undefined') {
        $(window).on('load', loadedFunction);
    }
}

/**
 * Create main vue module.
 * @param {object} options
 * @returns {CombinedVueInstance}
 */
export function createMainVue (options) {
    return new Vue(options);
}

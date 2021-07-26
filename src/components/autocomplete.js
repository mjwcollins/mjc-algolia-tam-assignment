import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';

// Instant Search Widgets
import { hits, searchBox, configure } from 'instantsearch.js/es/widgets';

// Autocomplete Template
import autocompleteProductTemplate from '../templates/autocomplete-product';

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 */
class Autocomplete {
    /**
     * @constructor
     */
    constructor() {
        this._registerClient();
        this._registerWidgets();
        this._startSearch();
    }

    /**
     * @private
     * Handles creating the search client and creating an instance of instant search
     * @return {void}
     */
    _registerClient() {
        this._searchClient = algoliasearch(
            '4LYE83VBGC',
            'd63d99ba5827fbe14a62c1deb5413067'
        );

        this._searchInstance = instantsearch({
            indexName: 'spencer_williams_products',
            searchClient: this._searchClient,
        });
    }

    /**
     * @private
     * Adds widgets to the Algolia instant search instance
     * @return {void}
     */
    _registerWidgets() {
        this._searchInstance.addWidgets([
            configure({
                hitsPerPage: 3,
            }),
            searchBox({
                container: '#searchbox',
            }),
            hits({
                container: '#autocomplete-hits',
                templates: { item: autocompleteProductTemplate },
            }),
        ]);
    }

    /**
     * @private
     * Starts instant search after widgets are registered
     * @return {void}
     */
    _startSearch() {
        this._searchInstance.start();
    }
}

export default Autocomplete;
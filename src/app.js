import Autocomplete from './components/autocomplete';

class SpencerAndWilliamsSearch {
    constructor() {
        this._initSearch();
        this._registerEvents();
    }

    _initSearch() {
        this.autocompleteDropdown = new Autocomplete();
    }

    _registerEvents() {
        const autocomplete = document.querySelector('.autocomplete');
        const searchbox = document.querySelector('#searchbox input');

        searchbox.addEventListener('click', () => {
            autocomplete.style.display = 'block';
        });

        searchbox.addEventListener('blur', () => {
            autocomplete.style.display = 'none';
        });
    }
}

const app = new SpencerAndWilliamsSearch();

import algoliasearch from 'algoliasearch'

const client = algoliasearch('4LYE83VBGC', 'd63d99ba5827fbe14a62c1deb5413067')

const index = client.initIndex('spencer_williams_products')

index.setSettings({
    //generally excludes ranking according to docs
    // higher in the list is more relevant
    searchableAttributes: [
        'brand',
        'name',
        'categories',
        'description',
        'type'
    ],
    //leave ranking alone
    //defualt Algolia ranking criteria should work - can edit later
    // customRanking: [
    //     'desc(popularity)'
    // ],
    attributesForFaceting: [
        'categories',
        //search for facet values
        'searchable(brand)',
        'price'
    ]
});

import { resultHit } from "./templates/result-hit";

const search = instantsearch({
    appId: "4LYE83VBGC",
    apiKey: "d63d99ba5827fbe14a62c1deb5413067",
    indexName: "spencer_williams_products",
    searchParameters: {
        hitsPerPage: 5,
        attributesToSnippet: ["description:24"],
        snippetEllipsisText: "[...]"
    }
});

search.addWidget(
    instantsearch.widgets.hits({
        container: "#hits",
        templates: {
            empty: "No results.",
            item: function(hit) {
                return resultHit(hit);
            }
        }
    })
);

search.addWidget(
    instantsearch.widgets.searchBox({
        container: "#searchbox",
        placeholder: "Search for products",
        autofocus: false
    })
);

search.addWidget(
        instantsearch.widgets.stats({
                container: "#stats",
                templates: {
                    body(hit) {
                        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${hit.nbHits}</strong> results found ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#categories",
    attributeName: "categories",
    autoHideContainer: false,
    templates: {
      header: "Categories"
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#brands",
    attributeName: "brand",
    searchForFacetValues: true,
    autoHideContainer: false,
    templates: {
      header: "Brands"
    }
  })
);

search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: "#price",
    autoHideContainer: false,
    attributeName: "price",
    templates: {
      header: "Price"
    }
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: "#pagination"
  })
);

search.start();


fetch('https://github.com/algolia/algolia-tam-assignment/blob/88f424f5b2dff80406b6bc4367fd7e84624b3764/package-lock.json')
    .then(function(response) {
        return response.json()
    })
    .then(function(products) {
        return index.saveObjects(products, {
            autoGenerateObjectIDIfNotExist: true
        })
    })
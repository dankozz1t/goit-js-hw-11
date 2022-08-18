import axios from 'axios';

export default class NewsApiService {
  static #API_KEY = '29265284-5f2624db05224bb980e7bf67d';
  static #BASE_URL = 'https://pixabay.com/api/';
  static #BASE_SEARCH_OPTIONS = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPage = 0;
    this.loadedNow = 0;
  }

  async fetchImages() {
    try {
      const searchOptions = {
        params: {
          ...[NewsApiService.#BASE_SEARCH_OPTIONS],
          q: this.searchQuery,
          page: this.page,
          per_page: this.per_page,
        },
      };
      this.incrementPage();
      this.resetLoaded();

      const url = `${NewsApiService.#BASE_URL}?key=${NewsApiService.#API_KEY}`;

      return axios.get(url, searchOptions);
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetLoaded() {
    this.loadedNow = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

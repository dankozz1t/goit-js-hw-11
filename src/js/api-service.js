import axios from 'axios';

const API_KEY = '29265284-5f2624db05224bb980e7bf67d';
const BASE_URL = 'https://pixabay.com/api/';
const BASE_SEARCH_OPTIONS = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 20;
  }

  async fetchImages() {
    try {
      this.incrementPage();

      const searchOptions = {
        params: {
          ...BASE_SEARCH_OPTIONS,
          q: this.searchQuery,
          page: this.page,
          per_page: this.per_page,
        },
      };

      const url = `${BASE_URL}?key=${API_KEY}`;

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

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

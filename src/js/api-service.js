const API_KEY = '29265284-5f2624db05224bb980e7bf67d';
const BASE_URL = 'https://pixabay.com/api/';

const TYPE = '&image_type=photo&orientation=horizontal&safesearch=true';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 20;
  }

  fetchImages() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}${TYPE}&page=${this.page}&per_page=${this.per_page}`;

    return fetch(url)
      .then(response => response.json())
      .then(images => {
        this.incrementPage();
        return images.hits;
      });
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

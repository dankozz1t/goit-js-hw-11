import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import templateImages from './templates/photo-card.hbs';
import NewsApiService from './js/api-service.js';
import LoadMoreBtn from './js/components/load-more-btn';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  imagesContainerEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('.search-form__input'),
  buttonEl: document.querySelector('.search-form__btn'),
};

const newsApiService = new NewsApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoomFactor: false,
});

refs.searchFormEl.addEventListener('submit', onSearch);
refs.inputEl.addEventListener('input', () => (refs.buttonEl.disabled = false));
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();
  refs.buttonEl.disabled = true;

  newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.searchQuery === '') {
    Notify.failure('❌Enter text');
    return;
  }

  loadMoreBtn.show();
  newsApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();

  newsApiService.fetchImages().then(({ data }) => {
    newsApiService.totalPage = Math.ceil(data.total / newsApiService.per_page);
    newsApiService.loadedNow += data.hits.length;

    if (newsApiService.page === 2) {
      Notify.success(`✅Hooray! We found ${data.total} images.`);
    }

    if (newsApiService.totalPage + 1 === newsApiService.page) {
      loadMoreBtn.hide();
    }

    if (data.hits.length === 0) {
      Notify.failure(
        '❌Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`✅Loaded ${newsApiService.loadedNow} images.`);
    appendImagesMarkup(data.hits);
    simpleLightbox.refresh();

    loadMoreBtn.enable();
  });
}

function appendImagesMarkup(images) {
  refs.imagesContainerEl.insertAdjacentHTML(
    'beforeend',
    templateImages(images)
  );
}

function clearImagesContainer() {
  refs.imagesContainerEl.innerHTML = '';
}

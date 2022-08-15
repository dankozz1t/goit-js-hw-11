import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import templateImages from './templates/photo-card.hbs';
import NewsApiService from './js/api-service.js';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();

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
  newsApiService.fetchImages().then(({ data: { hits: images } }) => {
    if (images.length === 0) {
      Notify.failure(
        '❌Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`✅Hooray! We found ${images.totalHits} images.`);
    appendImagesMarkup(images);
    loadMoreBtn.enable();
  });
}

function appendImagesMarkup(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', templateImages(images));
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

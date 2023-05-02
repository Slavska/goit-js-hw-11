import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './getImages';
import { addGallery } from './addImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scroll } from './scroll';

const formEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const hideBtn = () => (loadBtn.style.display = 'none');
const seenBtn = () => (loadBtn.style.display = 'block');
hideBtn();

let page = 1;
let perPage = 40;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

formEl.addEventListener('submit', submitBtn);
loadBtn.addEventListener('click', clickBtn);

async function submitBtn(evt) {
  evt.preventDefault();
  let result = formEl.elements.searchQuery.value.trim();
  clearAll();

  if (result === '') {
    hideBtn();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const imagesList = await getImages(result, page);
    let totalImages = imagesList.data.totalHits;

    if (imagesList.data.hits.length === 0) {
      clearAll();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalImages >= 1 && totalImages < 40) {
      hideBtn();
      Notify.success(`Hooray! We found ${totalImages} images.`);
    } else if (totalImages > 40) {
      seenBtn();
      Notify.success(`Hooray! We found ${totalImages} images.`);
    }
    addGallery(imagesList.data.hits);
    lightbox.refresh();
  } catch (error) {
    hideBtn();
    console.log(error);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function clickBtn() {
  page += 1;
  let result = formEl.elements.searchQuery.value.trim();

  try {
    const imagesList = await getImages(result, page);
    let totalPages = imagesList.data.totalHits / perPage;

    if (totalPages <= page) {
      hideBtn();
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    addGallery(imagesList.data.hits);
    scroll();
    lightbox.refresh();
  } catch (error) {
    hideBtn();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

const clearAll = () => {
  galleryList.innerHTML = '';
  page = 1;
};

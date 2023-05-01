import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { getImages } from './getImages';
import { renderGallery } from './renderGallery';

const formEl = document.querySelector('#search-form');
const inputEl = formEl.firstChild;
const btnEl = formEl.lastChild;
let page = 1;
const lightbox = new SimpleLightbox('.gallery a');

async function submitBtn(evt) {
  evt.preventDefault();
  let result = formEl.elements.searchQuery.value.trim();
  page = 1;
  if (result === '') {
    return Notify.info('The field is empty. Please try again.');
  }
  try {
    const galleryItems = await getImages(result, page);
    let totalPages = galleryItems.data.totalHits;

    if (galleryItems.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalPages >= 1 && totalPages < 40) {
      Notify.success(`Hooray! We found ${totalPages} image.`);
    } else if (totalPages > 40) {
      Notify.success(`Hooray! We found ${totalPages} image.`);
    }
    renderGallery(galleryItems.data.hits);
  } catch (error) {
    console.log(error);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

btnEl.addEventListener('submit', submitBtn);

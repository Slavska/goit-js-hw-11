import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './getImages';
import { addGallery } from './addImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scroll } from './scroll';

const formEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loading = document.querySelector('.loader-ellips');

const hideLoad = () => (loading.style.display = 'none');
const seenLoad = () => (loading.style.display = 'block');
const catchError = () =>
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
const success = total => Notify.success(`Hooray! We found ${total} images.`);
const clearAll = () => {
  galleryList.innerHTML = '';
  page = 1;
};

hideLoad();
formEl.addEventListener('submit', submitBtn);

let totalPages = 0;
let page = 1;
let perPage = 40;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

async function submitBtn(evt) {
  evt.preventDefault();
  let result = formEl.elements.searchQuery.value.trim();

  if (!result) {
    hideLoad();
    catchError();
    return;
  }

  try {
    const imagesList = await getImages(result, page);
    let totalImages = imagesList.data.totalHits;
    let totalPages = Math.ceil(imagesList.data.totalHits / perPage);

    if (imagesList.data.hits.length === 0) {
      clearAll();
      catchError();
      return;
    }
    seenLoad();
    success(totalImages);
    lightbox.refresh();
    const entry = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && result) {
          seenLoad();
          page += 1;
          getImages(result, page).then(images => {
            if (totalPages <= page) {
              observer.unobserve(loading);
              hideLoad();
              Notify.failure(
                "We're sorry, but you've reached the end of search results.",
                { cssAnimationDuration: 3000 }
              );
            }
            addGallery(images.data.hits);
          });
        }
      });
    };
    const observer = new IntersectionObserver(entry);
    observer.observe(loading);
  } catch (error) {
    hideLoad();
    clearAll();
    console.log(error);
    catchError();
  }
}

// loadBtn.addEventListener('click', clickBtn);
// const loadBtn = document.querySelector('.load-more');
// const hideBtn = () => (loadBtn.style.display = 'none');
// const seenBtn = () => (loadBtn.style.display = 'block');
// hideBtn();
// async function clickBtn() {
//   page += 1;
//   let result = formEl.elements.searchQuery.value.trim();
//   try {
//     const imagesList = await getImages(result, page);
//     let totalPages = imagesList.data.totalHits / perPage;

//     if (totalPages <= page) {
//       hideBtn();
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     addGallery(imagesList.data.hits);
//     scroll();
//     lightbox.refresh();
//   } catch (error) {
//     hideBtn();
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }

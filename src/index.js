import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './js/getImages';
import { addGallery } from './js/addImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scroll } from './js/scroll';

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

let page = 1;
let perPage = 40;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

const observer = new IntersectionObserver(entry);

async function submitBtn(evt) {
  evt.preventDefault();
  let result = formEl.elements.searchQuery.value.trim();
  clearAll();

  if (!result) {
    hideLoad();
    catchError();
    return;
  }

  try {
    const imagesList = await getImages(result, page);
    let totalImages = imagesList.data.totalHits;

    if (!imagesList.data.hits.length) {
      hideLoad();
      catchError();
      return;
    }
    page += 1;
    seenLoad();
    success(totalImages);
    observer.observe(loading);
    addGallery(imagesList.data.hits);
    lightbox.refresh();
    if (imagesList.data.hits.length === totalImages) {
      hideLoad();
      observer.unobserve(loading);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    hideLoad();
    clearAll();
    console.log(error);
    catchError();
  }
}

function entry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && formEl.elements.searchQuery.value.trim()) {
      seenLoad();
      page += 1;
      getImages(formEl.elements.searchQuery.value.trim(), page)
        .then(images => {
          if (Math.ceil(images.data.totalHits / perPage) <= page) {
            observer.unobserve(loading);
            hideLoad();
            Notify.failure(
              "We're sorry, but you've reached the end of search results.",
              { cssAnimationDuration: 3000 }
            );
          } else {
            addGallery(images.data.hits);
            scroll();
          }
        })
        .catch(error => {
          hideLoad(), catchError();
        });
    }
  });
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

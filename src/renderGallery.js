import SimpleLightbox from 'simplelightbox';
const galleryList = document.querySelector('.gallery');
export const renderGallery = gallery => {
  const addGallery = gallery
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class="gallery-link" href="${largeImageURL}"></a><div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>`
    )
    .join('');

  galleryList.insertAdjacentHTML('beforeend', addGallery);
};

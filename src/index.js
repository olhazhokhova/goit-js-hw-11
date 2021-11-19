import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import apiService from './js/api';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

let page = 1;
let totalHits = 0;

let simpleGallery = new SimpleLightbox('.gallery a');

window.addEventListener('DOMContentLoaded', () => {
  moreBtn.classList.add('hide');
  form.elements.searchButton.disabled = true;
});

form.elements.searchQuery.addEventListener('input', e => {
  form.elements.searchButton.disabled = e.currentTarget.value.length > 0 ? false : true;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const { searchQuery } = e.currentTarget.elements;
  page = 1;
  gallery.innerHTML = '';
  moreBtn.classList.add('hide');

  apiService(searchQuery.value, page).then(response => {
    totalHits = response.data.totalHits;
    if (page === 1 && totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderCardsMarkup(response.data);
    totalHits > 40 && moreBtn.classList.remove('hide');
    simpleGallery.refresh();
  });
});

moreBtn.addEventListener('click', () => {
  const { searchQuery } = form.elements;
  page += 1;
  apiService(searchQuery.value, page).then(response => {
    renderCardsMarkup(response.data);
    simpleGallery.refresh();
    totalHits -= 40;
    if (totalHits <= 40) {
      moreBtn.classList.add('hide');
    }
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
});

function renderCardsMarkup(data) {
  const markup = data.hits
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <a href="${largeImageURL}" class="img"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
            </p>
            <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
            </p>
            <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
            </p>
        </div>
    </div>`;
    })
    .join('');

  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else {
    gallery.insertAdjacentHTML('beforeend', markup);
  }
}

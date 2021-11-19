import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetch from './js/fetch';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

let page = 1;
let totalHits = 0;

window.addEventListener('DOMContentLoaded', () => {
  moreBtn.classList.add('hide');
  form.elements.searchButton.disabled = true;
  new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
});

form.elements.searchQuery.addEventListener('input', e => {
  form.elements.searchButton.disabled = e.currentTarget.value.length > 0 ? false : true;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  moreBtn.classList.add('hide');
  const { searchQuery } = e.currentTarget.elements;
  fetch(searchQuery.value, page).then(data => {
    totalHits = data.totalHits;
    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderCardsMarkup(data);
    totalHits > 0 && moreBtn.classList.remove('hide');
  });
});

moreBtn.addEventListener('click', () => {
  const { searchQuery } = form.elements;
  page += 1;
  fetch(searchQuery.value, page).then(data => {
    renderCardsMarkup(data);
    totalHits -= 40;
    if (totalHits <= 40) {
      moreBtn.classList.add('hide');
    }
  });
});

function renderCardsMarkup(data) {
  const markup = data.hits
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <div class="img"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
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

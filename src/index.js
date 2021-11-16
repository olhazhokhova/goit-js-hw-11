import './css/styles.css';
import Notiflix from 'notiflix';

import fetch from './js/fetch';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', e => {
  e.preventDefault();

  const { searchQuery, searchButton } = e.currentTarget.elements;

  fetch(searchQuery.value).then(renderCardsMarkup);
});

function renderCardsMarkup(data) {
  const markup = data.hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <div class="img"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
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

  gallery.innerHTML = markup;
}

// Notiflix.Notify.success('Sol lucet omnibus');
// Notiflix.Notify.failure('Qui timide rogat docet negare');
// Notiflix.Notify.warning('Memento te hominem esse');
// Notiflix.Notify.info('Cogito ergo sum');

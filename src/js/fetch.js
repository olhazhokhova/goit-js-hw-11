import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24372714-1e07211a49a3cb54d7764ff43';

const fetchImages = (query, page) => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
  ).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    return response.json();
  });
};

export default fetchImages;

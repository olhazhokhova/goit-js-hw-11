import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24372714-1e07211a49a3cb54d7764ff43';

const fetchImages = async (query, page) => {
  return await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
  );
};

export default fetchImages;

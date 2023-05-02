import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35957586-0745b2ddc07475bae1ad912ea';
export async function getImages(value, page = 1, perPage = 40) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

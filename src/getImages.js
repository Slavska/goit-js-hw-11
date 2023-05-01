import axios from 'axios';

const options = {
  url: 'https://pixabay.com/api/',
  key: '35957586-0745b2ddc07475bae1ad912ea',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export async function getImages(value, page = 1, perPage = 40) {
  try {
    // const response = await axios.get(
    //   `${options.url}?key=${options.key}&q=${value}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${page}&per_page=${perPage}`
    // );
    const response = await axios.get(
      `https://pixabay.com/api/?key=35957586-0745b2ddc07475bae1ad912ea&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

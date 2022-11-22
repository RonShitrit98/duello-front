import { httpService } from './http.service';

export const giphyService = {
  getTrending,
  search,
};

async function getTrending() {
  try {
    const res = await httpService.get('giphy/trending');
    return res.map((item) => item.images.downsized.url);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function search(searchTerm) {
  try {
    const res = await httpService.get(`giphy/search?=${searchTerm}`);
    return res.map((item) => item.images.downsized.url);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

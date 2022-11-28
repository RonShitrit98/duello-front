import { utilService } from "./util.service.js";
import axios from "axios";
import { FastAverageColor } from "fast-average-color";

const DESIGN = {
  imgs: getImgs(),
  colors: [
    {
      id: utilService.makeId(),
      color: "#61bd4f",
    },
    {
      id: utilService.makeId(),
      color: "#f2d600",
    },
    {
      id: utilService.makeId(),
      color: "#ff9f1a",
    },
    {
      id: utilService.makeId(),
      color: "#eb5a46",
    },
    {
      id: utilService.makeId(),
      color: "#c377e0",
    },
    {
      id: utilService.makeId(),
      color: "#0079bf",
    },
    {
      id: utilService.makeId(),
      color: "#00c2e0",
    },
    {
      id: utilService.makeId(),
      color: "#51e898",
    },
    {
      id: utilService.makeId(),
      color: "#ff78cb",
    },
    {
      id: utilService.makeId(),
      color: "#344563",
    },
  ],
  suggestedSearches: [
    "Productivity",
    "Prespective",
    "Organization",
    "Colorful",
    "Nature",
    "Business",
    "Minimal",
    "Space",
    "Animal",
  ],
};

export const designService = {
  getImgs,
  query,
  getAvgColor,
};

async function getImgs(
  amount = 6,
  searchWord = "desktop background",
  size = "regular"
) {
  const imgs = await axios.get(
    `https://api.unsplash.com/search/photos?client_id=QTIqWCQzY5ksfEbIUOklkb-vvjwfZZUeWemdkfe0IjA&per_page=${amount}&query=${searchWord}`
  );
  const result = imgs.data.results.map((res) => {
    return {
      url: res.urls[size],
      thumb: res.urls.thumb,
    };
  });
  return result;
}

function query() {
  return DESIGN;
}
async function getAvgColor(imgUrl) {
  const fac = new FastAverageColor();
  const color = await fac.getColorAsync(imgUrl);
  return color;
}

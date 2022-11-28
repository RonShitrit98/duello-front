import { utilService } from "./util.service.js";
import axios from "axios";
import { FastAverageColor } from "fast-average-color";


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
  try {
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
  } catch (error) {}
}


function query() {
  return {
    imgs: [
      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwxfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwxfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },
      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwyfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwyfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },
      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwzfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHwzfHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },
      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1451481086097-f6a15d5f8d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw0fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1451481086097-f6a15d5f8d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw0fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },
      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1502657877623-f66bf489d236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw1fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw1fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },

      {
        _id: utilService.makeId(),
        thumb:
          "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw2fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=200",
        url: "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTMxMTB8MHwxfHNlYXJjaHw2fHxkZXNrdG9wJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE2Njk2Mzk4MDk&ixlib=rb-4.0.3&q=80&w=1080",
      },
    ],
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
}
async function getAvgColor(imgUrl) {
  const fac = new FastAverageColor();
  const color = await fac.getColorAsync(imgUrl);
  return color;
}

export const utilService = {
  makeId,
  loadFromSessionStorage,
  saveToSessionStorage,
  applyDrag,
  spliceItem,
  spliceItem2,
  findItem,
};
function makeId(length = 8) {
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function loadFromSessionStorage(key) {
  var val = sessionStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

function saveToSessionStorage(key, val) {
  if (!val._id) val._id = makeId();
  sessionStorage[key] = JSON.stringify(val);
  return val;
}

function applyDrag(arr, dragResult) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
}

function spliceItem(itemId, itemList, replace = false) {
  console.log(itemId, itemList)
  const idx = itemList.findIndex((item) => itemId === item.id);
  if (idx < 0) return
  else if (!replace) itemList.splice(idx, 1);
  else itemList.splice(idx, 1, replace);
  return itemList;
}
function spliceItem2(itemId, itemList, replace = false) {
  console.log(itemId, itemList)
  const idx = itemList.findIndex((item) => itemId === item._id);
  if (idx < 0) return
  else if (!replace) itemList.splice(idx, 1);
  else itemList.splice(idx, 1, replace);
  return itemList;
}

function findItem(itemId, itemList) {
  console.log(itemId, itemList);
  return itemList.find((item) => item.id === itemId);
}

// function applyDrag(arr, dragResult) {
//   const { removedIndex, addedIndex, payload } = dragResult;
//   // if (removedIndex === null && addedIndex === null) return arr;
//   const result = [...arr];
//   let itemToAdd = payload;
//   if (removedIndex !== null) {
//     itemToAdd = result.splice(removedIndex, 1)[0];
//   }
//   if (addedIndex !== null) {
//     result.splice(addedIndex, 0, itemToAdd);
//   }
//   return result;
// };

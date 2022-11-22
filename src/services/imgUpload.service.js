import Axios from "axios";

import { httpService } from './http.service';

export const imgService = {
  uploadImg,
  getImg,
};

const api_key = '212946379684631';
const cloud_name = 'dtseyauom';
// It's okay for these to be public on client-side JS
// You just don't ever want to leak your API Secret

async function uploadImg(img) {
  console.log(img)
  // // get signature. In reality you could store this in localstorage or some other cache mechanism, it's good for 1 hour
  const signatureResponse = await httpService.get('img/signature');
  console.log(signatureResponse);

  const data = new FormData();
  data.append('file', img[0]);
  data.append('api_key', api_key);
  data.append('signature', signatureResponse.signature);
  data.append('timestamp', signatureResponse.timestamp);

  const cloudinaryResponse = await Axios.post(
    // `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: function (e) {
        // console.log(e.loaded / e.total);
      },
    }
  );
  console.log(cloudinaryResponse.data)
  return getImg(cloudinaryResponse.data.public_id);

  // // send the image info back to our server
  // const photoData = {
  //   public_id: cloudinaryResponse.data.public_id,
  //   version: cloudinaryResponse.data.version,
  //   signature: cloudinaryResponse.data.signature,
  // };

  // Axios.post("/do-something-with-photo", photoData);
}

function getImg(imgId) {
  // return `https://res.cloudinary.com/${cloud_name}/image/upload/w_200,h_100,c_fill,q_100/${imgId}.png`
  return `https://res.cloudinary.com/${cloud_name}/image/upload/${imgId}.png`;
}

// export const uploadImg = (ev) => {
//   //Defining our variables
//   const UPLOAD_PRESET = 'cajan_22'; //insert yours
//   const CLOUD_NAME = 'dozkz32wv'; //insert yours
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
//   const FORM_DATA = new FormData();
//   //Building the request body
//   FORM_DATA.append('file', ev.target.files[0]); // form data kind of key : file, add the file we get
//   FORM_DATA.append('upload_preset', UPLOAD_PRESET); // add the upload_preset
//   //Sending a post method request to Cloudinary`s API
//   return fetch(UPLOAD_URL, {
//     // add the img to Cloudinary
//     method: 'POST',
//     body: FORM_DATA,
//   })
//     .then((res) => res.json())
//     .then((res) => res) //return the res
//     .catch((err) => console.error(err));
// };

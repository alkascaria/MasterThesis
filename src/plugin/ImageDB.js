import axios from 'axios';

const IMAGE_API_URL ='http://127.0.0.1:5000/api/piktogramm';

export function ImageDB(editor) {
  
  editor.ui.registry.addMenuButton('imageMenuButton', {
    text: 'Insert Symbol',
    fetch: async function(callback) {
      try {
        const response = await axios.get(IMAGE_API_URL); //Fetching images from the database
        const images = response.data;
        
        const items = images.map((image) => ({
          type: 'menuitem',
          text: image._id, 
          onAction: function() {
            editor.insertContent(`<img src="${image.symbol}" alt="${image._id}"/>`);
          }
        }));
        callback(items);
      } catch (error) {
        console.error(error);
        editor.notificationManager.open({
          text: 'Failed to load images. Please try again later.',
          type: 'error'
        });
      }
    }
  });

  return {
    getMetadata: function () {
      return {
        name: "ImageDB plugin",
        url: "http://localhost:3000", // replace with the URL of the address where the app is hosted
      };
    },
  };
}

export default ImageDB;

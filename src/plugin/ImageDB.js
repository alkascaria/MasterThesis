import axios from 'axios';

export function ImageDB(editor) {
  
  editor.ui.registry.addMenuButton('imageMenuButton', {
    text: 'Insert Symbol',
    fetch: async function(callback) {
      try {
        // Calling `editor.ui.registry.updateMenuItem` function to dynamically update the menu items with the fetched images
        // The DB formant is (id,acronym,description,symbol), the below 2 line changes according to the format of the DB

        const response = await axios.get('http://127.0.0.1:5000/api/images'); //Fetching images from the database
        const images = response.data;
        
        const items = images.map((image, index) => ({
          type: 'menuitem',
          text: image.acronym, 
          onAction: function() {
            editor.insertContent(`<img src="${image.symbol}" alt="${image.acronym}"/>`);
          }
        }));
        callback(items);

      } catch (error) {
        console.error(error);
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

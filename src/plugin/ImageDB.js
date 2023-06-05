import axios from 'axios';

function ImageDB(editor) {
  let images = [];
  
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/images'); //Fetching images from the database
      images = response.data;
                
      // Calling `editor.ui.registry.updateMenuItem` function to dynamically update the menu items with the fetched images

      // The DB formant is (id,acronym,description,symbol), the below 2 line changes according to the format of the DB

      editor.ui.registry.addMenuButton('imageMenuButton', {
        text: 'Insert Symbol',
        fetch: function(callback) {
          
          const items = images.map((image, index) => ({
            type: 'menuitem',
            text: image.acronym, 
            onAction: function() {
              editor.insertContent(`<img src="${image.symbol}" alt="${image.acronym}"/>`);
            }
          }));
          callback(items);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch the images when the plugin is initialized
  fetchImages(); 
  
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


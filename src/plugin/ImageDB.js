import * as apiService from "../files/apiService";

export function ImageDB(editor) {
  editor.ui.registry.addMenuButton("imageMenuButton", {
    text: "Insert Symbol",
    fetch: async function (callback) {
      try {
        const response = await apiService.fetchPiktogramms(); //Fetching images from the database
        const images = response.data;

        const items = images.map((image) => ({
          type: "menuitem",
          text: image._id,
          onAction: function () {
            editor.insertContent(
              `<img src="${image.symbol}" alt="${image._id}"/>`
            );
          },
        }));
        callback(items);
      } catch (error) {
        console.error(error);
        editor.notificationManager.open({
          text: "Failed to load images. Please try again later.",
          type: "error",
        });
      }
    },
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

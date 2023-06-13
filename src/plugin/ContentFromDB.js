import axios from 'axios';

export function ContentDB(editor) {
  
  editor.ui.registry.addMenuButton('contentMenuButton', {
    text: 'Insert HTML',
    fetch: async function (callback) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/contents'); // Fetching contents from the database
        const dbContents = response.data;

        const items = dbContents.map((content, index) => ({
          type: 'menuitem',
          text: content.name,
          onAction: function () {
            editor.setContent(content.content);
          },
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
        name: "ContentDB plugin",
        url: "http://localhost:3000", // replace with the URL of the address where the app is hosted
      };
    },
  };
}

export default ContentDB;

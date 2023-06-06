import axios from 'axios';

function ContentDB(editor) {
  let dbContents = [];

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/contents'); // Fetching contents from the database
      dbContents = response.data;

      editor.ui.registry.addMenuButton('contentMenuButton', {
        text: 'Insert HTML',
        fetch: function (callback) {
          const items = dbContents.map((content, index) => ({
            type: 'menuitem',
            text: content.name,
            onAction: function () {
              editor.setContent(content.content);
            },
          }));
          callback(items);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch the contents when the plugin is initialized
  fetchContents();
}

export default ContentDB;

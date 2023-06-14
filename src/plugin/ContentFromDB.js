import axios from 'axios';

export function ContentDB(editor) {
  
  editor.ui.registry.addMenuButton('contentMenuButton', {
    text: 'Insert HTML',
    fetch: async function (callback) {

      try {
        
        const response = await axios.get('http://127.0.0.1:5000/api/contents'); // Fetching contents from the database
        const dbContents = response.data;

        // Group the content by group name
        let groupedContents = dbContents.reduce((groups, content) => {
          (groups[content.group] = groups[content.group] || []).push(content);
          return groups;
        }, {});

        // Create menu items for each group
        const groupItems = Object.keys(groupedContents).map(groupName => {
          let group = {
            type: 'nestedmenuitem',
            text: groupName,
            getSubmenuItems: () => {
              return groupedContents[groupName].map((content, index) => ({
                type: 'menuitem',
                text: content.name,
                onAction: function () {
                  editor.setContent(content.content);
                },
              }));
            },
          };
          return group;
        });

        callback(groupItems);

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

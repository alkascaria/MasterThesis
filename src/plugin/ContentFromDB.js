import * as apiService from "../files/apiService";

export function ContentDB(editor) {
  editor.ui.registry.addMenuButton("contentMenuButton", {
    text: "Insert HTML",
    async fetch(callback) {
      try {
        const response = await apiService.fetchContents();
        const dbContents = response.data;

        // Group the content by groupID
        let groupedContents = dbContents.reduce((groups, content) => {
          const groupID = content.groupID.name; // Convert the groupID to a string

          // If the groupID is not yet a property in the groups object,
          // we add it with a new array. Otherwise, we use the existing array.
          (groups[groupID] = groups[groupID] || []).push(content);

          return groups; // We return the groups object to be used in the next iteration
        }, {}); // We start with an empty object

        // Create menu items for each group
        const groupItems = Object.keys(groupedContents).map((groupID) => {
          let group = {
            type: "nestedmenuitem",
            text: groupID,
            getSubmenuItems: () => {
              return groupedContents[groupID].map((content, index) => ({
                type: "menuitem",
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
    },
  });

  return {
    getMetadata: function () {
      return {
        name: "ContentDB plugin",
        url: "http://localhost:3000", // Replace with the URL of the address where the app is hosted
      };
    },
  };
}

export default ContentDB;

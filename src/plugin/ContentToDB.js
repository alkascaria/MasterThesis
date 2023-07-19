import * as apiService from'../files/apiService';

// Writing contents into DB
export const saveToDB = async (groupToSave, docName, editorRef, setIsModalOpen, setGroupFunction, setName) => {

  // Check if the document name field is empty or only contains whitespace
  if (!docName.trim()) { 
    alert('Please enter a document name.');
    return;
  }

  if (editorRef.current) {
    const content = editorRef.current.getContent(); // Get the current content of the TinyMCE editor
    const currentDate = new Date().toDateString();

    // Send the name, current date, and content to the server for saving
    const data = {
      name: docName,
      date: currentDate,
      content: content,
      groupID: groupToSave,
    };

    try {

      // Fetch all groups from the database
      const groupResponse = await  apiService.fetchGroups();
      const groups = groupResponse.data;

      // Check if the group exists
      const groupExists = groups.some(group => group.name === groupToSave);

      if(groupExists)
      {
        // Check if the document already exists
        const response = await apiService.checkContents(docName,groupToSave);
      
        if (response.data.exists) {
          const update = window.confirm('This document already exists. Do you want to update it?');

          if (update) {
            // Update the existing document
            await apiService.updateContents(docName,data);
            alert('Content updated in the database!');
          } else {
            alert('Please enter a new document name.');
          }
        } else {
          // Create a new document
          await apiService.saveContents(data);
          alert('Content saved to the database!');
        }
      } else {
        // Create a new document with new group
        await apiService.saveContents(data);
        alert('Content saved to the database!');
      }

      // Close the modal and reset the name input field
      setIsModalOpen(false);
      setName('');
      setGroupFunction("");
      
    } catch (error) {
      console.error(error);
      alert('Error saving content to the database.');
    }
  }
}
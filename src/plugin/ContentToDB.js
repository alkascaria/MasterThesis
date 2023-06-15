import axios from 'axios';

// For the pop-up window onclick SaveToDB button - Modal Styles
export const customModalStyles = { 
  content: {
    width: '300px',
    height: '200px',
    margin: 'auto',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Writing contents into DB
export const saveToDB = async (groupToSave, docName, editorRef, setIsModalOpen, etGroupFunction, setName) => {

  const API_BASE_URL = "http://127.0.0.1:5000/api";
  console.log(groupToSave);
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
      console.log(groupToSave);

      // Fetch all groups from the database
      const groupResponse = await axios.get(`${API_BASE_URL}/groups`);
      const groups = groupResponse.data;

      // Check if the group exists
      const groupExists = groups.some(group => group._id === groupToSave);

      if(groupExists)
      {
        // Check if the document already exists
        const response = await axios.get(`${API_BASE_URL}/checkContent/${docName}/${groupToSave}`);
      
        if (response.data.exists) {
          const update = window.confirm('This document already exists. Do you want to update it?');

          if (update) {
            // Update the existing document
              await axios.put(`${API_BASE_URL}/updateContent/${docName}`, data);
            alert('Content updated in the database!');
          } else {
            alert('Please enter a new document name.');
          }
        } else {
          // Create a new document
          await axios.post(`${API_BASE_URL}/saveContent`, data);
          alert('Content saved to the database!');
        }
      } else {
        // Create a new document with new group
        await axios.post(`${API_BASE_URL}/saveContent`, data);
        alert('Content saved to the database!');
      }

      // Close the modal and reset the name input field
      setIsModalOpen(false);
      setName('');
      etGroupFunction("");
      
    } catch (error) {
      console.error(error);
      alert('Error saving content to the database.');
    }
  }
}
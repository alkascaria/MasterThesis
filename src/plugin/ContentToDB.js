import axios from 'axios';

//For the pop-up window onclick SaveToDB button
export const customModalStyles = { //Modal Styles
    content: {
      width: '300px',
      height: '200px',
      margin: 'auto',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
};

//Writing contents into DB
export const saveToDB = async (selectedOption, doc_Name, editorRef, setIsModalOpen, setSelectedOption, setName) => {

    if (!doc_Name.trim()) { //checking if the document name feild is empty
      alert('Please enter a document name.');
      return;
    }

    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const currentDate = new Date().toDateString();

       // Send the name, current date, and content to the server for saving
      const data = {
        id: doc_Name + currentDate, // Assuming the name is the unique ID
        name: doc_Name,
        date: currentDate,
        content: content,
        groupID: selectedOption,
      };

      try {
        // Perform the API call to save the data to the database
        // Check if the document already exists
        const response = await axios.get(`http://127.0.0.1:5000/api/checkContent/${doc_Name}`);

        if (response.dataexists) {
          console.log('Here1');
          const update = window.confirm('This document already exists. Do you want to update it?');

          if (update) {
            // Update the existing document
            await axios.put(`http://127.0.0.1:5000/api/updateContent/${doc_Name}`, data);
            alert('Content updated in the database!');
          } else {
            alert('Please enter a new document name.');
          }
        } else {
          // Create a new document
          await axios.post('http://127.0.0.1:5000/api/saveContent', data);
          alert('Content saved to the database!');
        }
        
        // Close the modal and reset the name input field
        setIsModalOpen(false);
        setName('');
        setSelectedOption("");
      } catch (error) {
        console.error(error);
        alert('Error saving content to the database.');
      }
    }
}
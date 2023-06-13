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
export const saveToDB = async (doc_Name, editorRef, setIsModalOpen, setName) => {
    if (!doc_Name.trim()) {
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
      };

      try {
        // Perform the API call to save the data to the database
        const response = await axios.post('http://127.0.0.1:5000/api/saveContent', data);
        //console.log(response.data);
        alert('Content saved to the database!');

        // Close the modal and reset the name input field
        setIsModalOpen(false);
        setName('');
      } catch (error) {
        console.error(error);
        alert('Error saving content to the database.');
      }
    }
}
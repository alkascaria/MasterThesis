import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import axios from 'axios';
import Modal from 'react-modal';

import ImageDB from './plugin/ImageDB.js';
import ContentDB from './plugin/ContentDB.js';

export default function App() {
  const editorRef = useRef(null);
  
  // Cutom drop down plugin to fetch symbols from DB 
  useEffect(() => {

    let checkCount = 0;
    const maxChecks = 50; // Stop checking after 5 seconds

    const timer = setInterval(() => {
      checkCount++;

      if (window.tinymce || checkCount > maxChecks){
        clearInterval(timer);
        window.tinymce.PluginManager.add('ImageDB', ImageDB);
        window.tinymce.PluginManager.add('ContentDB', ContentDB);
      }
    }, 100);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []); 

  //To save the current content as HTML or TXT
  const saveAsHTML = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent();
      let blob = new Blob([content], { type: 'text/html' });
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'content.html'; //link.download = 'content.txt';
      link.click();
    }
  };

  //For the pop-up window onclick SaveToDB button
  const [doc_Name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  React.useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const customModalStyles = { //Modal Styles
    content: {
      width: '300px',
      height: '200px',
      margin: 'auto',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //Writing contents into DB
  const saveToDB = async () => {
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
        console.log(response.data);
        alert('Content saved to the database!');

        // Close the modal and reset the name input field
        closeModal();
        setName('');

      } catch (error) {
        console.error(error);
        alert('Error saving content to the database.');
      }
    }
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customModalStyles}>
        <h2>Enter Document Name</h2>
        <input 
          type="text" 
          value={doc_Name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Document Name" 
          required
        />
        <button onClick={saveToDB}>Save</button>
      </Modal>

      <Editor
        tinymceScriptSrc='./tinymce/tinymce.min.js'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',          'autolink',
            'lists',            'link',
            'image',            'charmap',
            'anchor',           'searchreplace',
            'visualblocks',     'code',
            'fullscreen',       'insertdatetime',
            'media',            'table',
            'preview',          'help',
            'wordcount',        'ImageDB',
            'ContentDB'
          ],
          toolbar:
            'undo redo | blocks | image | imageMenuButton ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | code | contentMenuButton',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
      <button onClick={saveAsHTML}>Save as HTML</button>
      <button onClick={openModal}>Save to DB</button>
    </>
  );
}
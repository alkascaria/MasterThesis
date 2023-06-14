import './App.css';

import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Modal from 'react-modal';

import { SaveFile } from './plugin/SaveFile.js';
import { customModalStyles, saveToDB } from './plugin/ContentToDB';
import ImageDB from './plugin/ImageDB';
import ContentDB from './plugin/ContentFromDB';

export default function App() {
  
  const editorRef = useRef(null);

  const [doc_Name, setName] = useState('');
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Adding custom plugin
  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 50; // Stop checking after 5 seconds

    const timer = setInterval(() => {
      checkCount++;

      if (window.tinymce || checkCount > maxChecks) {

        clearInterval(timer);

        if (!window.tinymce.PluginManager.get('ImageDB')) {
          window.tinymce.PluginManager.add('ImageDB', ImageDB);
        }
        if (!window.tinymce.PluginManager.get('ContentDB')) {
          window.tinymce.PluginManager.add('ContentDB', ContentDB);
        }
      }
    }, 100);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []);

  // Define the custom plugin initialization within the setup function
  const setup = (editor) => {

    if (!window.tinymce.PluginManager.get('ImageDB')) {
      window.tinymce.PluginManager.add('ImageDB', ImageDB);
    }
    if (!window.tinymce.PluginManager.get('ContentDB')) {
      window.tinymce.PluginManager.add('ContentDB', ContentDB);
    }
  };

  return (
    <>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={
          {
            height: 700,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'anchor', 'searchreplace', 'visualblocks', 'code',
              'fullscreen', 'insertdatetime', 'media', 'table',
              'preview', 'help', 'wordcount', 'ImageDB', 'ContentDB'
            ],
            toolbar:
              'undo redo | blocks | image | imageMenuButton ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | code | contentMenuButton',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            setup: setup, // Pass the setup function to the TinyMCE init config
          }
        }
      />

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customModalStyles}>
        <h2>Enter Experiment and Document Name</h2>
        <div className="modal-content">
          <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value="">Select an experiment group</option>
            <option value="SäureBase1">SäureBase1</option> 
            <option value="SäureBase2">SäureBase2</option>
          </select>
              
          <input
            className='margin-top'
            type="text"
            value={doc_Name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Document Name"
            required
          />
          <button onClick={() => saveToDB(selectedOption, doc_Name, editorRef, setIsModalOpen, setSelectedOption, setName)}>Save</button>
        </div>
      </Modal>

      <button onClick={log}>Log editor content</button>
      <button onClick={() => SaveFile(editorRef)}>Save File</button>
      <button onClick={openModal}>Save to DB</button> 
    </>
  );
}

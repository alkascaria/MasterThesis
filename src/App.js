import './App.css';

import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Modal from 'react-modal';

import { SaveFile } from './plugin/SaveFile.js';
import { customModalStyles, saveToDB } from './plugin/ContentToDB'; // Button to save Content to DB
import ImageDB from './plugin/ImageDB'; // Plugin for displaying for Symbol
import ContentDB from './plugin/ContentFromDB'; // Plugin for displaying HTML file

export default function App() {
  const editorRef = useRef(null);

  // State variables initialization
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setName] = useState(''); // Document name - new
  const [newGroupId, setNewGroupId] = useState(''); // Expriment Group - new
  const [selectedOption, setSelectedOption] = useState(""); // Expriment Group - existing
  const [groups, setGroups] = useState([]); // Expriment groups in DB
  const [warningMessage, setWarningMessage] = useState("");

  // Function to log the current content of the editor
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  // Functions to open and close the modal window
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to add the custom plugins to TinyMCE
  const addPlugins = () => {
    if (!window.tinymce.PluginManager.get('ImageDB')) {
      window.tinymce.PluginManager.add('ImageDB', ImageDB);
    }
    if (!window.tinymce.PluginManager.get('ContentDB')) {
      window.tinymce.PluginManager.add('ContentDB', ContentDB);
    }
  };

  // Define the custom plugin initialization within the setup function
  const setup = (editor) => {
    addPlugins();
  };

  // Effect to check for the existence of TinyMCE and add the custom plugins
  useEffect(() => {

    let checkCount = 0;
    const maxChecks = 50; // Stop checking after 5 seconds
    // Set an interval to periodically check for the existence of TinyMCE
    const timer = setInterval(() => {
      checkCount++;

      // If TinyMCE exists or the maximum number of checks has been reached, stop the interval
      if (window.tinymce || checkCount > maxChecks) {
        clearInterval(timer);
        addPlugins(); // Add the custom plugins to TinyMCE
      }
    }, 100);

    return () => clearInterval(timer); // Clean up the interval when the component unmounts
  }, []);

  // Effect to set the root element for the modal
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  // Effect to fetch the group data from the API
  useEffect( () => {
    fetch('http://localhost:5000/api/groups') 
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error:', error));
  }, [newGroupId]);

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
              'bold italic forecolor table | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent ' +
              ' contentMenuButton | help | code ',
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
            {groups.map(group => (
              <option key={group._id} value={group.name}>{group.name}</option>
            ))}
          </select>
      
          <input
            className='margin-top'
            type="text"
            value={newGroupId}
            onChange={(e) => {
              let groupId = e.target.value;
              setNewGroupId(groupId);
              let exists = groups.some(group => group.name === groupId);
              if(exists) {
                setWarningMessage("Group ID already exists. Please enter a new one.");
              } else {
                setWarningMessage("");
              }
            }}
            placeholder="Enter new group ID"
          />
          
          <input
            className='margin-top'
            type="text"
            value={docName}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter document Name"
            required
          />

          <button onClick={() => {
            if(selectedOption || newGroupId) {
              let groupToSave = selectedOption ? selectedOption : newGroupId;
              let setGroupFunction = selectedOption ? setSelectedOption : setNewGroupId;
              saveToDB(groupToSave, docName, editorRef, setIsModalOpen, setGroupFunction, setName);
              setWarningMessage("");
            } else {
              setWarningMessage("Please either select an existing group or enter a new group ID");
            }
          }}>Save</button>

          {warningMessage && <div className="warning">{warningMessage}</div>}
        </div>
      </Modal>

      <button onClick={log}>Log editor content</button>
      <button onClick={() => SaveFile(editorRef)}>Save File</button>
      <button onClick={openModal}>Save to DB</button> 
    </>
  );
}
import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import ImageDB from './plugin/ImageDB.js';

export default function App() {
  const editorRef = useRef(null);
  
  // Creating a cutom plugin to fetch images from the database and use a drop down menu
  useEffect(() => {

    // since we are trying to add a custom plugin in the useEffect hook, it is important to ensure that tinymce is fully loaded 
    // before attempting to call 'window.tinymce.PluginManager.add'
    // This code sets up an interval that checks every 100ms if window.tinymce is defined, and if it is, it clears the interval 
    // and then adds the custom plugin. If the component unmounts, it also clears the interval to prevent memory leaks. 
    
    let checkCount = 0;
    const maxChecks = 50; // Stop checking after 5 seconds

    const timer = setInterval(() => {
      checkCount++;

      if (window.tinymce || checkCount > maxChecks){
        clearInterval(timer);
        window.tinymce.PluginManager.add('ImageDB', ImageDB);
      }
    }, 100);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []); 

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

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

  //Writing into DB
  const saveToDB = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/saveContent', { content });
        console.log(response.data);
        alert('Content saved to the database!');
      } catch (error) {
        console.error(error);
        alert('Error saving content to the database.');
      }
    }
  };

  return (
    <>
      <Editor
        tinymceScriptSrc='./tinymce/tinymce.min.js'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
            'ImageDB'
          ],
          toolbar:
            'undo redo | blocks | image | ImageMenuButton ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | code ',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
      <button onClick={saveAsHTML}>Save as HTML</button>
      <button onClick={saveToDB}>Save to DB</button>
    </>
  );
}
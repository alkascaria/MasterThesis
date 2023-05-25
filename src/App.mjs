import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function App() {
  const editorRef = useRef(null);

  // Creating a cutom plugin to fetch images from the database and use a drop down menu
  useEffect(() => {

    // since we are trying to add a custom plugin in the useEffect hook, it is important to ensure that tinymce is fully loaded 
    // before attempting to call 'window.tinymce.PluginManager.add'
    // This code sets up an interval that checks every 100ms if window.tinymce is defined, and if it is, it clears the interval 
    // and then adds the custom plugin. If the component unmounts, it also clears the interval to prevent memory leaks. 
       
    const timer = setInterval(() => {
      if (window.tinymce) {
        clearInterval(timer);
        window.tinymce.PluginManager.add('customPlugin', function(editor) {
          let images = [];
        
          const fetchImages = async () => {
            try {
              const response = await axios.get('http://127.0.0.1:5000/api/images'); //Fetching images from the database
              images = response.data;
        
              // Calling `editor.ui.registry.updateMenuItem` function to dynamically update the menu items with the fetched images

              // The DB formant is (id,acronym,description,symbol), the below 2 line changes according to the format of the DB

              editor.ui.registry.updateMenuItem('imageMenuButton', {
                fetch: function(callback) {
                  const items = images.map((image, index) => ({
                    type: 'menuitem',
                    text: image.symbol, 
                    onAction: function() {
                      editor.insertContent(`<img src="${image.symbol}" alt="${image.acronym}">`);
                    }
                  }));
                  callback(items);
                }
              });
            } catch (error) {
              console.error(error);
            }
          };
          // Fetch the images when the plugin is initialized
          fetchImages();
          
          // Register the menu button - Custom dropdown menu
          editor.ui.registry.addMenuButton('imageMenuButton', {
            text: 'Insert Symbol',
            fetch: function(callback) {
              const items = images.map((image, index) => ({
                type: 'menuitem',
                text: image.acronym, 
                onAction: function() {
                  editor.insertContent(`<img src="${image.symbol}" alt="${image.acronym}">`);
                }
              }));
              callback(items);
            }
          });
        });
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
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'customPlugin',
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
            'wordcount'
          ],
          toolbar:
            'undo redo | blocks | image ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | code | imageMenuButton',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
      <button onClick={saveAsHTML}>Save as HTML</button>
      <button onClick={saveToDB}>Save to DB</button>
    </>
  );
}
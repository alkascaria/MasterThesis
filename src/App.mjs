import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';


export default function App() {
  const editorRef = useRef(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  //To download the source code as HTML or txt file
  const saveAsHTML = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent(); //Gets the current content of tinymce
      let blob = new Blob([content], { type: 'text/html' });
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'content.html'; //Saves as html file
      //link.download = 'content.txt'; //Saves as txt file
      link.click();
    }
  };


  //To save content to DB, in here MongoDB
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
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | code',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        
      />
      <button onClick={log}>Log editor content</button>
      <button onClick={saveAsHTML}>Save as HTML</button>
      <button onClick={saveToDB}>Save to DB</button>
    </>
  );
}
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function App() {
  const editorRef = useRef(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  //To download the source code as HTML or txt filenp
  const saveContentAsHTML = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent();
      let blob = new Blob([content], { type: 'text/html' });
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'content.html';
      link.download = 'content.txt';
      link.click();
    }
  };

  const saveContentToDatabase = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent();
      
      fetch('http://localhost:3000/api/saveContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });
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
      <button onClick={saveContentAsHTML}>Save as HTML</button>
      <button onClick={saveContentToDatabase}>Save to DB</button>
    </>
  );
}
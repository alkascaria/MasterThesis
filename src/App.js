import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "react-modal";

import { SaveFile } from "./plugin/SaveFile.js";
import { addPlugins } from "./files/PluginManger";
import { ExperimentGroups } from "./files/ExperimentGroup";
import EditorModal from "./files/EditorModal";
import DeleteModal from "./files/DeleteModal.js";
import HPModal from "./files/HPModal.js";

export default function App() {
  const editorRef = useRef(null);

  // State variables initialization
  const [docName, setName] = useState(""); // Document name - new
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedOption, setSelectedOption] = useState(""); // Expriment Group - existing
  const [warningMessage, setWarningMessage] = useState("");
  const [groups, newGroupId, setNewGroupId] = ExperimentGroups("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Function to log the current content of the editor
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  // Create a state to hold the editor content
  const [editorContent, setEditorContent] = useState("");

  // Update the editor content state whenever the editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.getContent());
    }
  };

  // Functions to open and close the modal window
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHPModalOpen, setIsHPModalOpen] = useState(false);

  const openEditorModal = () => setIsEditorModalOpen(true);
  const closeEditorModal = () => setIsEditorModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openHPModal = () => setIsHPModalOpen(true);
  const closeHPModal = () => setIsHPModalOpen(false);

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
    Modal.setAppElement("#root");
  }, []);

  return (
    <>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={handleEditorChange}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 700,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
            "ImageDB",
            "ContentDB",
          ],
          toolbar:
            "undo redo | blocks | image | imageMenuButton " +
            "bold italic forecolor table | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent " +
            " contentMenuButton | help | code ",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          setup: setup, // Pass the setup function to the TinyMCE init config
        }}
      />

      <EditorModal
        isModalOpen={isEditorModalOpen}
        closeModal={closeEditorModal}
        groups={groups}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        newGroupId={newGroupId}
        setNewGroupId={setNewGroupId}
        docName={docName}
        setName={setName}
        warningMessage={warningMessage}
        setWarningMessage={setWarningMessage}
        editorRef={editorRef}
      />

      <DeleteModal
        isModalOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />

      <HPModal
        isModalOpen={isHPModalOpen}
        closeModal={closeHPModal}
        editorContent={editorContent}
        editorRef={editorRef}
      />

      <button onClick={log}>Log editor content</button>
      <button onClick={() => SaveFile(editorRef)}>Save File</button>
      <button onClick={openEditorModal}>Save to DB</button>
      <button onClick={openDeleteModal}>Delete from DB</button>
      <button onClick={openHPModal}>Mögliche Gefahren Table</button>
    </>
  );
}

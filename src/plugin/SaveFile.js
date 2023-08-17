export const SaveFile = (editorRef) => {
  if (editorRef.current) {
    let content = editorRef.current.getContent();
    let blob = new Blob([content], { type: "text/html" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.html"; //link.download = 'content.txt';
    link.click();
  }
};

export const HP = (editorRef) => {
    console.log(editorRef.current.getContent());
    let selectedNode = editorRef.current.selection.getNode();
    while (selectedNode && selectedNode.nodeName !== "TABLE") {
        selectedNode = selectedNode.parentNode;
    }

    if (selectedNode) {
        // Now selectedNode should be the <table> element
        const rows = Array.from(selectedNode.rows); // Convert HTMLCollection to Array

        const tableData = rows.map(row => {
            const cells = Array.from(row.cells); // Convert HTMLCollection to Array

            return cells.map(cell => cell.innerHTML); // Get the text content of each cell
        });

        console.log('Table Data:', tableData);
        tableData.forEach((row, i) => {
            row.forEach((cell, j) => {
                console.log(`Row ${i+1}, Cell ${j+1}:`, cell);
            });
        });
    }
};

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import * as apiService from "./apiService";

const HPModal = ({ isModalOpen, closeModal, editorContent, editorRef }) => {
  const [chemicalName, setChemicalName] = useState([]);
  const [ghsList, setGhsList] = useState([]);
  const [hSatzList, setHSatzList] = useState([]);
  const [pSatzList, setPSatzList] = useState([]);
  const [euhSatzList, setEuhSatzList] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [cellContents, setCellContents] = useState([
    [
      {
        chemical: [],
        ghs: [],
        achtungGefahr: "",
        hsatz: [],
        psatz: [],
        euhsatz: [],
      },
    ],
  ]);

  const [selectedGhs, setSelectedGhs] = useState([]);
  const [selectedAchtungGefahr, setSelectedAchtungGefahr] = useState(null);
  const [selectedHSatz, setSelectedHSatz] = useState([]);
  const [selectedPSatz, setSelectedPSatz] = useState([]);
  const [selectedEuhSatz, setSelectedEuhSatz] = useState([]);

  const [achtungGefahrState, setAchtungGefahrState] = useState(false);

  const handleAchtungGefahrBlur = () => {
    setAchtungGefahrState(true);
  };

  const handleAddRow = () => {
    // Adding a row
    setCellContents([
      ...cellContents,
      new Array(cellContents[0].length)
        .fill(null)
        .map(() => ({
          chemical: [],
          ghs: [],
          achtungGefahr: "",
          hsatz: [],
          psatz: [],
          euhsatz: [],
        })),
    ]);
  };

  const handleAddColumn = () => {
    // Adding a column
    setCellContents(
      cellContents.map((row) => [
        ...row,
        {
          chemical: [],
          ghs: [],
          achtungGefahr: "",
          hsatz: [],
          psatz: [],
          euhsatz: [],
        },
      ])
    );
  };

  const handleDeleteRow = () => {
    if (cellContents.length > 1) {
      const newCellContents = [...cellContents];
      newCellContents.pop();
      setCellContents(newCellContents);
    }
  };

  const handleDeleteColumn = () => {
    if (cellContents[0].length > 1) {
      const newCellContents = cellContents.map((row) => {
        const newRow = [...row];
        newRow.pop();
        return newRow;
      });
      setCellContents(newCellContents);
    }
  };

  const parseTableContents = (rows) => {
    const newCellContents = [];
    // Skip the first row as it contains the header
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const cells = Array.from(row.cells);
      const rowData = [];

      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex];

        const images = Array.from(cell.querySelectorAll("img"));
        const ghs = images.map((image) => ({ src: image.src }));

        const htmlContent = cell.innerHTML;

        const lines = htmlContent
          .split("<br>")
          .filter((line) => line.trim() !== ""); // Splitting by '<br>'

        const hsatz = [];
        const psatz = [];
        const euhsatz = [];
        let achtungGefahr = "";
        let chemical = [];

        lines.forEach((line) => {
          // Temporary div to convert HTML string into text
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = line;
          const text = tempDiv.textContent || tempDiv.innerText || "";

          if (text.startsWith("H")) {
            hsatz.push(text);
          } else if (text.startsWith("P")) {
            psatz.push(text);
          } else if (text.startsWith("EUH")) {
            euhsatz.push(text);
          } else if (text.includes("Gefahr") || text.includes("Achtung")) {
            achtungGefahr = text;
          } else if (text !== "") {
            chemical.push(text);
          }
        });

        const cellContent = {
          chemical,
          ghs,
          achtungGefahr,
          hsatz,
          psatz,
          euhsatz,
        };

        rowData.push(cellContent);
      }
      newCellContents.push(rowData);
    }
    setCellContents(newCellContents);
  };

  useEffect(() => {
    if (editorRef.current) {
      const content = editorContent;

      const target =
        '<th style="font-size: xx-large;" colspan="2">M&ouml;gliche Gefahren</th>';

      if (content.includes(target)) {
        // Find the start of the target section
        const start = content.lastIndexOf("<table", content.indexOf(target));

        // Find the end of the table
        const end = content.indexOf("</table>", start);

        // Extract the table
        const table = content.substring(start, end + "</table>".length);

        // Parse the HTML string into a Document object
        const parser = new DOMParser();
        const doc = parser.parseFromString(table, "text/html");

        // Get all the rows from the table
        const rows = Array.from(doc.querySelectorAll("tr"));

        parseTableContents(rows);
      }
    }
  }, [editorContent]);

  useEffect(() => {
    //Fetch GHS options
    const fetchGhsOptions = async () => {
      try {
        const response = await apiService.fetchGhsOptions();
        setGhsList(response.data);
      } catch (error) {
        console.error("Error fetching GHS options", error);
      }
    };

    fetchGhsOptions();
  }, []);

  useEffect(() => {
    //Fetch HSatz options
    const fetchHSatzOptions = async () => {
      try {
        const response = await apiService.fetchHSatzOptions();
        setHSatzList(response.data);
      } catch (error) {
        console.error("Error fetching HSatz options", error);
      }
    };

    fetchHSatzOptions();
  }, []);

  useEffect(() => {
    //Fetch PSatz options
    const fetchPSatzOptions = async () => {
      try {
        const response = await apiService.fetchPSatzOptions();
        setPSatzList(response.data);
      } catch (error) {
        console.error("Error fetching PSatz options", error);
      }
    };

    fetchPSatzOptions();
  }, []);

  useEffect(() => {
    //Fetch EUHSatz options
    const fetchEuhSatzOptions = async () => {
      try {
        const response = await apiService.fetchEuhSatzOptions();
        setEuhSatzList(response.data);
      } catch (error) {
        console.error("Error fetching EuhSatz options", error);
      }
    };

    fetchEuhSatzOptions();
  }, []);

  const handleChemicalChange = (e) => {
    const chemicalList = e.target.value.split(",").map((str) => str.trim());
    setChemicalName(chemicalList);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.chemical = chemicalList;
      setCellContents(newCellContents);
    }
  };

  const GhsDropdown = ({ options, value, onChange }) => (
    <div>
      <label>Select GHS Nummer: </label>
      <Select
        isMulti
        options={options}
        onChange={onChange}
        placeholder="Select GHS Nummer"
        value={value}
      />
    </div>
  );
  const ghsOptions = ghsList.map((ghs) => ({
    value: ghs._id,
    label: ghs._id,
    symbol: ghs.symbol,
  }));

  const handleGhsChange = (selectedGhsOptions) => {
    setSelectedGhs(selectedGhsOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.ghs = selectedGhsOptions.map((option) => ({
        src: option.symbol,
      }));
      setCellContents(newCellContents);
    }

    if (selectedGhsOptions.length > 0 && !selectedAchtungGefahr) {
      // Set state to show error
      setAchtungGefahrState(true);
    }
  };

  const achtungGefahrOptions = [
    { value: "Achtung", label: "Achtung" },
    { value: "Gefahr", label: "Gefahr" },
  ];

  const handleAchtungGefahrChange = (selectedOption) => {
    setSelectedAchtungGefahr(selectedOption);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.achtungGefahr = selectedOption.value;
      setCellContents(newCellContents);
    }
  };

  const HSatzDropdown = ({ options, value, onChange }) => (
    <div>
      <label>Select HSatz Nummer: </label>
      <Select
        isMulti
        options={options}
        onChange={onChange}
        placeholder="Select HSatz Nummer"
        value={value}
      />
    </div>
  );
  const hSatzOptions = hSatzList.map((hSatz) => ({
    value: hSatz._id,
    label: hSatz._id,
    description: hSatz.description,
  }));

  const handleHSatzChange = (selectedHSatzOptions) => {
    setSelectedHSatz(selectedHSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.hsatz = selectedHSatzOptions.map(
        (option) => option.value + ": " + option.description
      );
      setCellContents(newCellContents);
    }
  };

  const PSatzDropdown = ({ options, value, onChange }) => (
    <div>
      <label>Select PSatz Nummer: </label>
      <Select
        isMulti
        options={options}
        onChange={onChange}
        placeholder="Select PSatz Nummer"
        value={value}
      />
    </div>
  );
  const pSatzOptions = pSatzList.map((pSatz) => ({
    value: pSatz._id,
    label: pSatz._id,
    description: pSatz.description,
  }));

  const handlePSatzChange = (selectedPSatzOptions) => {
    setSelectedPSatz(selectedPSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.psatz = selectedPSatzOptions.map(
        (option) => option.value + ": " + option.description
      );
      setCellContents(newCellContents);
    }
  };

  const EuhSatzDropdown = ({ options, value, onChange }) => (
    <div>
      <label>Select EuhSatz Nummer: </label>
      <Select
        isMulti
        options={options}
        onChange={onChange}
        placeholder="Select EuhSatz Nummer"
        value={value}
      />
    </div>
  );
  const euhOptions = euhSatzList.map((euh) => ({
    value: euh._id,
    label: euh._id,
    description: euh.description,
  }));

  const handleEuhSatzChange = (selectedEuhSatzOptions) => {
    setSelectedEuhSatz(selectedEuhSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const cellContent = newCellContents[selectedCell.row][selectedCell.col];
      cellContent.euhsatz = selectedEuhSatzOptions.map(
        (option) => option.value + ": " + option.description
      );
      setCellContents(newCellContents);
    }
  };

  const handleCellChange = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });

    // Get the content for the new cell
    const cellContent = cellContents[rowIndex][colIndex];

    // Update chemical name
    setChemicalName(cellContent.chemical.join("\n"));

    setSelectedAchtungGefahr(
      achtungGefahrOptions.find(
        (option) => option.value === cellContent.achtungGefahr
      ) || null
    );

    // If cellContent has ghs, hsatz, psatz, or euhsatz then set them to the respective states.
    setSelectedGhs(
      cellContent.ghs.map((item) =>
        ghsOptions.find((option) => option.symbol === item.src)
      ) || []
    );

    // Here we match based only on the "H" number
    setSelectedHSatz(
      cellContent.hsatz
        .map((item) =>
          hSatzOptions.find((option) => option.value === item.split(":")[0])
        )
        .filter(Boolean) // This removes any 'undefined' values
    );

    setSelectedPSatz(
      cellContent.psatz
        .map((item) =>
          pSatzOptions.find((option) => option.value === item.split(":")[0])
        )
        .filter(Boolean)
    );

    setSelectedEuhSatz(
      cellContent.euhsatz
        .map((item) =>
          euhOptions.find((option) => option.value === item.split(":")[0])
        )
        .filter(Boolean)
    );
  };

  const generateImgHtml = (src) =>
    `<img src="${src}" alt="" style="width: 80px; height: 80px;" />`;

  const generateCellHtml = (cell) => {
    const chemical = cell.chemical.join("<br/>");
    return `
      <td style="border: 2px solid black; border-bottom: border: 1px solid black; padding: 10px; font-size: large; width: 50%;">
        <div><strong>${chemical + "<br/>"}</strong></div>
        <strong>${
          cell.ghs.map((item) => generateImgHtml(item.src)).join("") + "<br/>"
        }</strong>
        <strong>${cell.achtungGefahr + "<br/>"}</strong> 
        ${cell.hsatz.join("<br />") + "<br/>"}
        ${cell.psatz.join("<br />") + "<br/>"}
        ${cell.euhsatz.join("<br />") + "<br/>"}
      </td>
    `;
  };

  const generateRowHtml = (row) => {
    return `<tr style="vertical-align: top;">${row
      .map((cell) => generateCellHtml(cell))
      .join("<br />")}</tr>`;
  };

  const handleTable = () => {
    // Check if editor instance is available
    if (editorRef.current) {
      let content = editorRef.current.getContent();

      const target =
        '<th style="font-size: xx-large;" colspan="2">M&ouml;gliche Gefahren</th>';

      // Generate the new table
      let tableHtml = `
        <table style="font-size: x-large; border-spacing: 0; margin: 0 auto; table-layout: fixed;">
          <tr>
            <th colspan=2 style="font-size: xx-large;"> Mögliche Gefahren </th>
          </tr>
        `;
      // Iterate over cellContents to generate table rows
      cellContents.forEach((row) => {
        tableHtml += generateRowHtml(row);
      });
      tableHtml += "</tbody></table>";

      if (content.includes(target)) {
        // Find the start of the target section
        const start = content.lastIndexOf("<table", content.indexOf(target));

        // Find the end of the table
        const end = content.indexOf("</table>", start) + "</table>".length;

        // Replace the old table with the new one
        content =
          content.substring(0, start) + tableHtml + content.substring(end);

        // Set the new content to the editor
        editorRef.current.setContent(content);
      } else {
        // If there's no existing table, insert the new table at the current cursor position
        editorRef.current.insertContent(tableHtml);
      }
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Create Table Modal"
    >
      <h2>Mögliche Gefahren</h2>

      <div>
        <button onClick={handleAddRow}>+ Row</button>
        <button onClick={handleDeleteRow}>- Row</button>
      </div>

      <div>
        <button onClick={handleAddColumn}>+ Column</button>
        <button onClick={handleDeleteColumn}>- Column</button>
      </div>

      <div>
        <label>Enter Chemical Name: </label>
        <textarea
          id="chemicalName"
          value={chemicalName}
          onChange={handleChemicalChange}
          placeholder="Enter Chemical Name"
        />
      </div>

      <GhsDropdown
        options={ghsOptions}
        value={selectedGhs}
        onChange={handleGhsChange}
      />

      {selectedGhs.length > 0 && (
        <div>
          <label>Select Achtung or Gefahr: </label>
          <Select
            options={achtungGefahrOptions}
            value={selectedAchtungGefahr}
            onChange={handleAchtungGefahrChange}
            onBlur={handleAchtungGefahrBlur}
            placeholder="Select Achtung oder Gefahr"
            style={
              achtungGefahrState && !selectedAchtungGefahr
                ? { borderColor: "red" }
                : null
            }
          />
          {achtungGefahrState && !selectedAchtungGefahr && (
            <div style={{ color: "red" }}>This field is required</div>
          )}
        </div>
      )}

      <HSatzDropdown
        options={hSatzOptions}
        value={selectedHSatz}
        onChange={handleHSatzChange}
      />

      <PSatzDropdown
        options={pSatzOptions}
        value={selectedPSatz}
        onChange={handlePSatzChange}
      />

      <EuhSatzDropdown
        options={euhOptions}
        value={selectedEuhSatz}
        onChange={handleEuhSatzChange}
      />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            border: "1px solid black",
            margin: "0 auto",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center", fontWeight: "bold" }}>
                Mögliche Gefahren
              </th>
            </tr>
          </thead>
          <tbody>
            {cellContents.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellChange(rowIndex, colIndex)}
                    style={{
                      padding: "50px",
                      border: "1px solid black",
                      boxShadow:
                        selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                          ? "0px 0px 10px 3px rgba(70,130,180,0.75)"
                          : "none", //Blue rgb
                    }}
                  >
                    <div>
                      <div>
                        {cell.chemical.map((name, index) => (
                          <p key={index}>{name}</p>
                        ))}
                      </div>
                      {cell.ghs.map((item, index) => (
                        <img
                          key={index}
                          src={item.src}
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      ))}
                      <div>{cell.achtungGefahr}</div>
                      {cell.hsatz.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                      {cell.psatz.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                      {cell.euhsatz.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleTable}>Enter Table</button>
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default HPModal;

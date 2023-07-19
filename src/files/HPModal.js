import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Select from 'react-select';

const API_BASE_URL = "http://127.0.0.1:5000/api";

const HPModal = ({ isModalOpen, closeModal, editorRef }) => {
  const [chemicalName, setChemicalName] = useState('');
  const [ghsList, setGhsList] = useState([]);
  const [hSatzList, setHSatzList] = useState([]);
  const [pSatzList, setPSatzList] = useState([]);
  const [euhSatzList, setEuhSatzList] = useState([]);
  const [cellContents, setCellContents] = useState([['']]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  const [selectedGhsOptions, setSelectedGhsOptions] = useState([]);
  const [selectedHSatzOptions, setSelectedHSatzOptions] = useState([]);
  const [selectedPSatzOptions, setSelectedPSatzOptions] = useState([]);
  const [selectedEuhSatzOptions, setSelectedEuhSatzOptions] = useState([]);

  const handleChemicalChange = (e) => {
    setChemicalName(e.target.value);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = [...(newCellContents[selectedCell.row][selectedCell.col] || []), { type: 'chemical', value: e.target.value}];
      setCellContents(newCellContents);
    }
  };

  const handleGhsChange = (selectedGhsOptions) => {
    setSelectedGhsOptions(selectedGhsOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = [...(newCellContents[selectedCell.row][selectedCell.col] || []), { type: 'ghs', value: selectedGhsOptions.map(Option => ({ src: Option.symbol })) }];
      setCellContents(newCellContents);
    }
};

const handleHSatzChange = (selectedHSatzOptions) => {
    setSelectedHSatzOptions(selectedHSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = [...(newCellContents[selectedCell.row][selectedCell.col] || []), { type: 'hsatz', value: selectedHSatzOptions.map(option => option.value + ': ' + option.description) }];
      setCellContents(newCellContents);
    }
};

const handlePSatzChange = (selectedPSatzOptions) => {
    setSelectedPSatzOptions(selectedPSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = [...(newCellContents[selectedCell.row][selectedCell.col] || []), { type: 'psatz', value: selectedPSatzOptions.map(option => option.value + ': ' + option.description) }];
      setCellContents(newCellContents);
    }
};

const handleEuhSatzChange = (selectedEuhSatzOptions) => {
    setSelectedEuhSatzOptions(selectedEuhSatzOptions);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = [...(newCellContents[selectedCell.row][selectedCell.col] || []), { type: 'euhsatz', value: selectedEuhSatzOptions.map(option => option.value + ': ' + option.description) }];
      setCellContents(newCellContents);
    }
};

  

  useEffect(() => {
    // Fetch GHS options
    const fetchGhsOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/piktogramm`);
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
            const response = await axios.get(`${API_BASE_URL}/hsatz`);
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
            const response = await axios.get(`${API_BASE_URL}/psatz`);
            setPSatzList(response.data);
        } catch (error) {
            console.error("Error fetching PSatz options", error);
        }
    };

    fetchPSatzOptions();
  }, []);

  useEffect(() => {
    //Fetch EuhSatz options
    const fetchEuhSatzOptions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/euhsatz`);
            setEuhSatzList(response.data);
        } catch (error) {
            console.error("Error fetching EuhSatz options", error);
        }
    };

    fetchEuhSatzOptions();
  }, []);
  
  const handleAddRow = () => {
    setCellContents([...cellContents, Array(cellContents[0].length).fill([])]);
};

const handleAddColumn = () => {
    setCellContents(cellContents.map(row => [...row, []]));
};



const handleCellChange = (rowIndex, colIndex) => {
  setSelectedCell({ row: rowIndex, col: colIndex });
  
  const selectedCellContent = cellContents[rowIndex][colIndex];
  
  const chemical = selectedCellContent.find(item => item.type === 'chemical');
  const ghs = selectedCellContent.filter(item => item.type === 'ghs');
  const hsatz = selectedCellContent.filter(item => item.type === 'hsatz');
  const psatz = selectedCellContent.filter(item => item.type === 'psatz');
  const euhsatz = selectedCellContent.filter(item => item.type === 'euhsatz');
  
  setChemicalName(chemical ? chemical.value : '');
  setSelectedGhsOptions(ghs.length > 0 ? ghs.map(item => ({ value: item.value[0].src, label: item.value[0].src, symbol: item.value[0].src })) : []);
  setSelectedHSatzOptions(hsatz.length > 0 ? hsatz.map(item => ({ value: item.value.split(':')[0], label: item.value.split(':')[0] })) : []);
  setSelectedPSatzOptions(psatz.length > 0 ? psatz.map(item => ({ value: item.value.split(':')[0], label: item.value.split(':')[0] })) : []);
  setSelectedEuhSatzOptions(euhsatz.length > 0 ? euhsatz.map(item => ({ value: item.value.split(':')[0], label: item.value.split(':')[0] })) : []);
};

  const handleTable = () => {
    // Check if editor instance is available
    if (editorRef.current) {
      let tableHtml = `<table style="border-collapse: collapse; border: 1px solid black; margin: 0 auto;">
        <thead style="text-align: center; font-weight: bold;">
          Mögliche Gefahren
        </thead>
        <tbody>`;
  
      // Iterate over cellContents to generate table rows
      cellContents.forEach((row, rowIndex) => {
        tableHtml += '<tr>';
        row.forEach((cell, colIndex) => {
          tableHtml += '<td style="padding: 50px; border: 1px solid black;">';
          if (Array.isArray(cell)) {
            cell.forEach((item, index) => {
              if (item.type === 'ghs') {
                item.value.forEach(ghsImage => {
                  tableHtml += `<img src="${ghsImage.src}" alt="" style="width: 100px; height: 100px;" />`;
                });
              } else if (item.type === 'chemical') {
                tableHtml += `<p>${item.value}</p>`;
              } else {
                tableHtml += `<p>${Array.isArray(item.value) ? item.value.join('<br />') : item.value.replace(/: /g, ": <br />")}</p>`;
              }
            });
          } else {
            tableHtml += cell;
          }
          tableHtml += '</td>';
        });
        tableHtml += '</tr>';
      });
  
      tableHtml += '</tbody></table>';
  
      // Insert the HTML string at the current cursor position in the editor
      editorRef.current.insertContent(tableHtml);
    }
    closeModal();
  };
  
  
  const ghsOptions = ghsList.map(ghs => ({ value: ghs._id, label: ghs._id, symbol: ghs.symbol }));
  const hSatzOptions = hSatzList.map(hSatz => ({value:hSatz._id, label: hSatz._id, description: hSatz.description}));
  const pSatzOptions = pSatzList.map(pSatz => ({value:pSatz._id, label: pSatz._id, description: pSatz.description}));
  const euhOptions = euhSatzList.map(euh => ({value:euh._id, label: euh._id, description: euh.description}));

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Create Table Modal"
    >
      <h2>Mögliche Gefahren</h2> 

      <div>
        <button onClick={handleAddRow}>+ Row</button>
      </div>
      
      <div>
        <button onClick={handleAddColumn}>+ Column</button>
      </div>
      
      <div>
        <label>Enter Chemical Name: </label>
        <input
          id="chemicalName"
          value={chemicalName}
          onChange={handleChemicalChange}
          placeholder="Enter Chemical Name"
        />
      </div>
      
      <div>
        <label>Select GHS Nummer: </label>
        <Select
          isMulti
          options={ghsOptions}
          value={selectedGhsOptions}
          onChange={handleGhsChange}
          placeholder="Select GHS Nummer"
        />
      </div>

      <div>
        <label>Select a HSatz: </label>
        <Select
            isMulti
            options={hSatzOptions}
            value={selectedHSatzOptions}
            onChange={handleHSatzChange}
            placeholder="Select H Satz"
        />
      </div>

      <div>
        <label>Select a Psatz: </label>
        <Select
          isMulti
          options={pSatzOptions}
          value={selectedPSatzOptions}
          onChange={handlePSatzChange}
          placeholder="Select P Satz"
        />
      </div>
      
      <div>
        <label>Select a EUH: </label>
        <Select
          isMulti
          options={euhOptions}
          value={selectedEuhSatzOptions}
          onChange={handleEuhSatzChange}
          placeholder="Select an EUH"
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', margin: '0 auto'  }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', fontWeight: 'bold' }}>
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
                      padding: '50px',
                      border: '1px solid black',
                      boxShadow: (selectedCell.row === rowIndex && selectedCell.col === colIndex) ? '0px 0px 10px 3px rgba(70,130,180,0.75)' : 'none'
                    }}
                  >
                    <div>
                      {Array.isArray(cell) ? (
                        cell.map((item, index) => {
                          if (item.type === 'ghs') {
                            return item.value.map(ghsImage => (
                              <img
                                key={ghsImage.src}
                                src={ghsImage.src}
                                alt=""
                                style={{ width: '100px', height: '100px' }}
                              />
                            ));
                          } else if (item.type === 'chemical') {
                            return (
                              <div key={index}>
                                {item.value}
                              </div>
                            );
                          } else {
                            return (
                              <div key={index} dangerouslySetInnerHTML={{ __html: Array.isArray(item.value) ? item.value.join('<br />') : item.value.replace(/: /g, ": <br />") }}>
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div>
                          {cell}
                        </div>
                      )}
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

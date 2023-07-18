import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Select from 'react-select';

const HPModal = ({ isModalOpen, closeModal, editorRef }) => {
  const [chemicalName, setChemicalName] = useState('');
  const [ghs, setGhs] = useState([]);
  const [hSatz, setHSatz] = useState('');
  const [pSatz, setPSatz] = useState('');
  const [euhSatz, setEuhSatz] = useState('');


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

  const handleGhsChange = (selectedGhsOptions) => {
    setSelectedGhsOptions(selectedGhsOptions);
    const selectedValues = selectedGhsOptions;
    setGhs(selectedValues);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      newCellContents[selectedCell.row][selectedCell.col] = selectedValues.map(Option => ({ src: Option.symbol }));
      setCellContents(newCellContents);
    }
  };
  
  const handleHSatzChange = (selectedHSatzOptions) => {
    setSelectedHSatzOptions(selectedHSatzOptions);
    const selectedValues = selectedHSatzOptions;
    setHSatz(selectedValues);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const selectedDescriptions = selectedValues.map(option => option.value + ': ' + option.description);
      newCellContents[selectedCell.row][selectedCell.col] = selectedDescriptions.join(', ');
      setCellContents(newCellContents);
    }
  };

  const handlePSatzChange = (selectedPSatzOptions) => {
    setSelectedPSatzOptions(selectedPSatzOptions);
    const selectedValues = selectedPSatzOptions;
    setPSatz(selectedValues);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const selectedDescriptions = selectedValues.map(option => option.value + ': ' + option.description);
      newCellContents[selectedCell.row][selectedCell.col] = selectedDescriptions.join(', ');
      setCellContents(newCellContents);
    }
  };

  const handleEuhSatzChange = (selectedEuhSatzOptions) => {
    setSelectedEuhSatzOptions(selectedEuhSatzOptions);
    const selectedValues = selectedEuhSatzOptions;
    setEuhSatz(selectedValues);
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newCellContents = [...cellContents];
      const selectedDescriptions = selectedValues.map(option => option.value + ': ' + option.description);
      newCellContents[selectedCell.row][selectedCell.col] = selectedDescriptions.join(', ');
      setCellContents(newCellContents);
    }
  };

  useEffect(() => {
    // Fetch GHS options
    const fetchGhsOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/piktogramm');
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
            const response = await axios.get('http://127.0.0.1:5000/api/hsatz')
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
            const response = await axios.get('http://127.0.0.1:5000/api/psatz')
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
            const response = await axios.get('http://127.0.0.1:5000/api/euhsatz')
            setEuhSatzList(response.data);
        } catch (error) {
            console.error("Error fetching EuhSatz options", error);
        }
    };

    fetchEuhSatzOptions();
  }, []);
  
  const handleAddRow = () => {
    setCellContents([...cellContents, Array(cellContents[0].length).fill('')]);
  };

  const handleAddColumn = () => {
    setCellContents(cellContents.map(row => [...row, '']));
  };


  const handleCellChange = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
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
          onChange={(e) => {
            setChemicalName(e.target.value);
            if (selectedCell.row !== null && selectedCell.col !== null) {
              const newCellContents = [...cellContents];
              newCellContents[selectedCell.row][selectedCell.col] = e.target.value;
              setCellContents(newCellContents);
            }
          }}
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
            <thead style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Mögliche Gefahren
            </thead>
          <tbody>
            {cellContents.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellChange(rowIndex, colIndex)}
                    style={{ padding: '50px', border: '1px solid black' }}
                  >
                    {Array.isArray(cell) ? (
                      cell.map((ghsImage, index) => (
                        <img
                          key={index}
                          src={ghsImage.src}
                          alt=""
                          style={{ width: '100px', height: '100px' }}
                        />
                      ))
                    ) : (
                      <span>{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default HPModal;

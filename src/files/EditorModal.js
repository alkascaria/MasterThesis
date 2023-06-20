import React from 'react';
import Modal from 'react-modal';
import { saveToDB } from '../plugin/ContentToDB'; // Button to save Content to DB

// For the pop-up window onclick SaveToDB button - Modal Styles
const customModalStyles = { 
    content: {
        width: 'auto',
        height: 'auto',
        maxWidth: '90%',
        maxHeight: '90%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: '20px', 
        overflow: 'auto', // Overflow auto to handle large contents
    },
};

const centeredContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

const inputStyles = {
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '20px'
};


export default function EditorModal({
  isModalOpen,
  closeModal,
  groups,
  selectedOption,
  setSelectedOption,
  newGroupId,
  setNewGroupId,
  docName,
  setName,
  warningMessage,
  setWarningMessage,
  editorRef
}) {
  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customModalStyles}>
      <h2>Enter Experiment and Document Name</h2>

      <div style={centeredContentStyles} className="modal-content">
        <select style={inputStyles} value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="">Select an experiment group</option>
          {groups.map(group => (
              <option key={group._id} value={group.name}>{group.name}</option>
          ))}
        </select>
        
        <div style={inputStyles}>
          <label htmlFor="newGroupId" style={{marginRight: '10px'}}>Enter new experiment group:</label>
          <input
            id="newGroupId"
            type="text"
            value={newGroupId}
            onChange={(e) => {
              let groupId = e.target.value;
              setNewGroupId(groupId);
              let exists = groups.some(group => group.name === groupId);
              if(exists) {
                setWarningMessage("Group ID already exists. Please enter a new one.");
              } else {
                setWarningMessage("");
              }
            }}
            placeholder="Enter new group ID"
          />
        </div>
          
        <div style={inputStyles}>
          <label htmlFor="docName" style={{marginRight: '10px'}}>Enter the document name:</label>
          <input
            id='docName'
            type="text"
            value={docName}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter document Name"
          />
        </div>
        
        <button onClick={() => {
            if(selectedOption && newGroupId) {
              setWarningMessage("Please select ONE, either an existing group or enter a new group");
            } else if(selectedOption || newGroupId) {
              let groupToSave = selectedOption ? selectedOption : newGroupId;
              let setGroupFunction = selectedOption ? setSelectedOption : setNewGroupId;
              saveToDB(groupToSave, docName, editorRef, closeModal, setGroupFunction, setName);
              setWarningMessage("");
            } else {
              setWarningMessage("Please either select an existing group or enter a new group");
            }
          }}>Save</button>

        {warningMessage && <div className="warning">{warningMessage}</div>}
      </div>
    </Modal>
  );
}

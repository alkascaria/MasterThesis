import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import * as apiService from './apiService';

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
    overflow: 'auto',
  },
};

export default function DeleteModal({
  isModalOpen,
  closeModal,
  groups,
  selectedGroup,
  setSelectedGroup,
  selectedDoc,
  setSelectedDoc,
}) {
  const [dropdownGroupOpen, setDropdownGroupOpen] = useState(false);
  const [groupedContents, setGroupedContents] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.fetchContents();
      const dbContents = response.data;

      let groups = dbContents.reduce((groups, content) => {
        const groupID = content.groupID.name; 
        (groups[groupID] = groups[groupID] || []).push(content);
        return groups; 
      }, {});

      setGroupedContents(groups);
    };

    fetchData();
  }, []);

  const deleteExperiment = async () => {
    try {

        let data;
        if(selectedGroup&&selectedDoc)
        {
            data = {
                groupName: selectedGroup,
                docName: selectedDoc
              };
        } else {
            data ={
                groupName: selectedGroup
            };
        }
        console.log(data);
        const response = await apiService.deleteContents(data);
      
      if (response.status === 200) {
        alert('Sucessfully deleted');
        closeModal();
      } else {
        alert('There was an error deleting the experiment or group');
      }
    } catch (err) {
      console.error(err);
      alert('There was an error deleting the experiment or group');
    }
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customModalStyles}>
      <div>
        <button onClick={() => setDropdownGroupOpen(!dropdownGroupOpen)}>Delete Experiment Group</button>
        {dropdownGroupOpen && (
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            <option value="">Select an experiment group to Delete</option>
            {groups.map((group) => (
              <option key={group._id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
  <button onClick={() => setDropdownGroupOpen(!dropdownGroupOpen)}>Delete Experiment</button>
  {dropdownGroupOpen && (
    <div>
      <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
        <option value="">Select an experiment group</option>
        {groups.map((group) => (
          <option key={group._id} value={group.name}>
            {group.name}
          </option>
        ))}
      </select>
      {selectedGroup && (
        <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
          <option value="">Select an experiment to Delete</option>
          {groupedContents[selectedGroup]?.map((content) => (
            <option key={content._id} value={content.name}>
              {content.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )}
</div>


      <button onClick={deleteExperiment}>Confirm Delete</button>
    </Modal>
  );
}

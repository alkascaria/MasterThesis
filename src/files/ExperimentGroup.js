import { useState, useEffect } from 'react';

export const ExperimentGroups = (initialGroupId) => {
  const [groups, setGroups] = useState([]); // Expriment groups in DB
  const [newGroupId, setNewGroupId] = useState(initialGroupId); // Expriment Group - new

  useEffect(() => {

    // Effect to fetch the group data from the API
    fetch('http://localhost:5000/api/groups') 
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error:', error));
  }, [newGroupId]);

  return [groups, newGroupId, setNewGroupId];
};

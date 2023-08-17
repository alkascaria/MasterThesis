import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export const fetchGhsOptions = async () => {
  return await axios.get(`${API_BASE_URL}/piktogramm`);
};

export const fetchHSatzOptions = async () => {
  return await axios.get(`${API_BASE_URL}/hsatz`);
};

export const fetchPSatzOptions = async () => {
  return await axios.get(`${API_BASE_URL}/psatz`);
};

export const fetchEuhSatzOptions = async () => {
  return await axios.get(`${API_BASE_URL}/euhsatz`);
};

export const fetchPiktogramms = async () => {
  return await axios.get(`${API_BASE_URL}/piktogramm`);
};

export const fetchContents = async () => {
  return await axios.get(`${API_BASE_URL}/contents`);
};

export const fetchGroups = async () => {
  return await axios.get(`${API_BASE_URL}/groups`);
};

export const checkContents = async (docName, groupToSave) => {
  return await axios.get(
    `${API_BASE_URL}/checkContent/${docName}/${groupToSave}`
  );
};

export const updateContents = async (docName, data) => {
  return await axios.put(`${API_BASE_URL}/updateContent/${docName}`, data);
};

export const saveContents = async (data) => {
  return await axios.post(`${API_BASE_URL}/saveContent`, data);
};

export const deleteContents = async (data) => {
  return await axios.delete("http://127.0.0.1:5000/api/delete", { data });
};

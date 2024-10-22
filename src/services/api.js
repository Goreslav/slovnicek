import axios from 'axios';

const API_URL = 'http://localhost:3333';

export function fetchWords() {
    return axios.get(`${API_URL}/get-words`);
}
export function fetchWordsById(id,count) {
    return axios.get(`${API_URL}/get-words-after/${id}/${count}`);
}

export function addWord(newWordObject) {
    return axios.post(`${API_URL}/create-entry`, newWordObject);
}

export function removeWord(wordId) {
    return axios.delete(`${API_URL}/delete-word/${wordId}`);
}

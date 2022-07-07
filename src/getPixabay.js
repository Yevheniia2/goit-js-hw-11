import axios from "axios";
const API_KEY = '28465620-b99d2f18707b881a5a8144a5c';
// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
const params = new URLSearchParams({
    key: API_KEY,
    q: 'cat',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
})
axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['key'] = API_KEY;

export class GetPixabayApi {
    constructor() { }
    async fetchImages() {
        const { data } = await axios.get(`? ${params}`);
        return data;
    }
}
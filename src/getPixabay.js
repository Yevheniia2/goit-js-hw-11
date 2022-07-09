import axios from "axios";
const API_KEY = '28465620-b99d2f18707b881a5a8144a5c';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class GetPixabayApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchImages() {
        const params = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });
        const { data } = await axios.get(`?${params}`);
        this.incrementPage();
        return data;
    }
    get searchQuery1() {
        this.searchQuery;
    }
    set searchQuery1(newSearchQuery) {
        this.searchQuery = newSearchQuery;
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
}
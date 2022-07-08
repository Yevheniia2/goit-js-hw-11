import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { GetPixabayApi } from './getPixabay.js';

Notify.init ({
    position: 'center-top',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const simpleLightbox = new SimpleLightbox('.gallery a');

formRef.addEventListener('submit', onFormSubmit);

const getPixabayApi = new GetPixabayApi();

function makeGalleryMarkup(searchedImages) {
    return searchedImages.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    })=>`<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </a>
            </div>
        </div>`).join('');
}

function renderGallery(searchedImages) {
    galleryRef.insertAdjacentHTML('beforeend', makeGalleryMarkup(searchedImages));
    simpleLightbox.refresh();
}

async function onFormSubmit(evt) {
    evt.preventDefault();
    clearGalleryMarkup();
    const request = evt.target.elements.searchQuery.value.trim();
    if(!request) return Notify.info('Please, enter something for search');
    GetPixabayApi.searchQuery1 = request;
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    if(!totalHits) {
        return Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
    Notify.success(`Hooray! We found ${totalHits} images.`)
    renderGallery(hits);
    evt.target.reset();
}

function clearGalleryMarkup() {
    galleryRef.innerHTML = '';
}

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.

// const { height: cardHeight } = document
//     .querySelector(".gallery")
//     .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//     top: cardHeight * 2,
//     behavior: "smooth",
// });
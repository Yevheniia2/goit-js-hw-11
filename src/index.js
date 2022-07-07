import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { GetPixabayApi } from './getPixabay';

Notify.init ({
    position: 'center-top',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');

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
}

async function onFormSubmit(evt) {
    evt.preventDefault();
    const request = evt.target.elements.searchQuery.value.trim();
    console.log(request);
    const { hits } = await getPixabayApi.fetchImages();
    renderGallery(hits);
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
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { GetPixabayApi } from './getPixabay.js';
import axios from "axios";

Notify.init ({
    position: 'center-top',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const loadMoreBtnRef = document.querySelector('.load-more');

const simpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 300,
});
const getPixabayApi = new GetPixabayApi();
// let request = null;
const API_KEY = '28465620-b99d2f18707b881a5a8144a5c';

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

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
    clearGalleryMarkup();
    getPixabayApi.resetPage();
    const request = evt.target.elements.searchQuery.value.trim();
    // console.log(request);
    // const infScroll = new InfiniteScroll(galleryRef, {
    //     path: await getPixabayApi.fetchImages(),
    //     scrollThreshold: 0,
    //     responseBody: 'json',
    //     status: '.page-load-status',
    //     history: false,
    //     });
    //     infScroll.on('load', function (body) {
    //     dataCheckerAndRender(body);
    // });
    // infScroll.pageIndex = 1;
    if(!request) return Notify.info('Please, enter something for search');
    getPixabayApi.searchQuery1 = request;
    try{
        const { hits, totalHits } = await getPixabayApi.fetchImages();
        if(!totalHits) {
            return Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        }
        Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGallery(hits);
        simpleLightbox.refresh();
    } catch(error) {
        console.log(error.message);
    }
    evt.target.reset();
//     infScroll.loadNextPage();
}

async function onLoadMoreBtnClick() {
    try{
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    renderGallery(hits);
    simpleLightbox.refresh();
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
});
    } catch(error) {
        console.log(error.message);
    }
}

function clearGalleryMarkup() {
    galleryRef.innerHTML = '';
}

// function dataCheckerAndRender(data) {
//     page = infScroll.pageIndex - 1;
//     console.log(page);
//     totalPages = Math.ceil(data.totalHits / per_page);
    // if (data.hits.length === 0) {
    //     Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //     );
    //     return;
    // }
    // if (page === 1) {
    //     Notify.info(`Hooray! We found ${data.totalHits} images.`);
    //     renderGallery(data);
    //     return;
    // }
//     if (page === totalPages) {
//         Notify.info("We're sorry, but you've reached the end of search results.");
//         renderGallery(data);
//         return;
//     }
//     renderGallery(data);
// }
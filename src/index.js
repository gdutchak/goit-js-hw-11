import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
import './css/style.css';

const refs = {
  form: document.querySelector(".search-form"),
  imageRef: document.querySelector(".gallery-list"),
  button: document.querySelector(".load-more"),
  input: document.querySelector('input')
}
let page = 1;
let imagePerPage = 40;

refs.button.classList.add('visually-hidden')

async function searchImage(name) {
  const API = '29165116-db33726688e81f885d73ac474';
  return await fetch(`https://pixabay.com/api/?key=${API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagePerPage}`)
    .then(responsive => {
      if (responsive.ok) { return responsive.json() }
      throw new Error("Sorry, there are no images matching your search query. Please try again.")
    })
}

function createImage(item) {
  return `<div class="photo-card">
  <div class="gallery">
  <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy""/></a>
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes <br>${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views <br>${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments <br>${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads <br>${item.downloads}</b>
    </p>
  </div>
</div>`
}

function showImage(value) {
  const result = value.reduce((acc, item) => acc + createImage(item), "")
  refs.imageRef.insertAdjacentHTML("beforeend", result)
}

function renderPage(e) {
  e.preventDefault();
  let valueEl = refs.form.elements['searchQuery'].value;
  refs.input.value = '';

  searchImage(valueEl).then(data => {
    let allResult = data.totalHits / imagePerPage
    if (data.hits.length === 0) {
      throw new Error("Sorry, there are no images matching your search query. Please try again.", { timeout: 1500 })
    }
    if (data.totalHits > imagePerPage) {
      refs.button.classList.remove('visually-hidden')
    }
    if (page > allResult && data.totalHits > imagePerPage) {
      refs.button.classList.add('visually-hidden')
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    showImage(data.hits)
  }).catch(error => Notify.failure(error.message))
}
refs.form.addEventListener("submit", (e) => {
  page = 1;
  refs.imageRef.innerHTML = ''
  renderPage(e)
})

refs.button.addEventListener('click', (e) => {
  page += 1;
  renderPage(e)
})


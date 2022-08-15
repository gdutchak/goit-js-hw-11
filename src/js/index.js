import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/style.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Create from './create';
import searchImage from './searchImage';


refs = {
  form: document.querySelector(".search-form"),
  imageRef: document.querySelector(".gallery-list"),
  button: document.querySelector(".load-more"),
  input: document.querySelector('input')
}
let page = 1;
let imagePerPage = 40;
refs.button.classList.add('visually-hidden')


function showImage(value) {
  const result = value.reduce((acc, item) => acc + Create(item), "")
  refs.imageRef.insertAdjacentHTML("beforeend", result)
}

function renderPage(e) {
  e.preventDefault();
  let valueEl = refs.form.elements['searchQuery'].value;

  searchImage(valueEl, page, imagePerPage).then(response => {
    const { data } = response;
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
    new SimpleLightbox('.gallery a', { /* options */ });
    const { height: cardHeight } = refs.imageRef.firstElementChild.getBoundingClientRect();

  }).catch(error => Notify.failure(error.message))
}
refs.button.addEventListener('click', (e) => {
  page += 1;
  renderPage(e)

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  })
  SimpleLightbox.refresh()
})

refs.form.addEventListener("submit", (e) => {
  page = 1;
  if (refs.input.value !== '') {
    renderPage(e)
  }

})






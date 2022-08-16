import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/style.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Create from './create';
import searchImage from './searchImage';

const refs = {
  form: document.querySelector(".search-form"),
  imageRef: document.querySelector(".gallery-list"),
  button: document.querySelector(".load-more"),
  input: document.querySelector('input')
};

let page = 1;
let imagePerPage = 40;
let nameSearch = '';
refs.button.classList.add('visually-hidden')


function showImage(value) {
  const result = value.reduce((acc, item) => acc + Create(item), "")
  refs.imageRef.insertAdjacentHTML("beforeend", result)
}

function renderPage(e, name) {
  e.preventDefault();
  searchImage(name, page, imagePerPage).then(response => {
    const { data } = response;
    let allResult = data.totalHits / imagePerPage
    if (data.hits.length === 0) {
      refs.button.classList.add('visually-hidden')
      throw new Error("Sorry, there are no images matching your search query. Please try again.", { timeout: 1500 })
    }
    if (page > allResult && page > 1) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (data.totalHits > imagePerPage) {
      refs.button.classList.remove('visually-hidden')
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    showImage(data.hits)
    new SimpleLightbox('.gallery a', {});
    let { height: cardHeight } = refs.imageRef.firstElementChild.getBoundingClientRect();
    if (page >= 2) {
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      })
    }
  }).catch(error => Notify.failure(error.message))
}

refs.form.addEventListener("submit", (e) => {
  page = 1;
  refs.imageRef.innerHTML = ''
  let valueEl = refs.form.elements['searchQuery'].value;
  nameSearch = valueEl;
  if (refs.input.value !== '') {
    renderPage(e, nameSearch)
  }
  refs.form.elements['searchQuery'].value = '';
  refs.button.classList.add('visually-hidden')
})

refs.button.addEventListener('click', (e) => {
  page += 1;
  renderPage(e, nameSearch);

})




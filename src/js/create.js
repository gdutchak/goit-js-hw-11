export default function createImage(item) {
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
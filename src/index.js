import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

refs.select.addEventListener('change', onSelectChange);

function createCatList() {
  changeVisibility(refs.error);

  fetchBreeds()
    .then(data => {
      renderOptionsList(data);
      changeVisibility(refs.loader);
      changeVisibility(refs.select);
    })
    .catch(error => {
      Notify.failure(refs.error.textContent);
      changeVisibility(refs.loader);
    });
}

createCatList();

function onSelectChange(evt) {
  changeVisibility(refs.loader);

  const selectedBreedId = evt.currentTarget.value;

  fetchCatByBreed(selectedBreedId)
    .then(data => {
      renderMarkupInfo(data);
      changeVisibility(refs.loader);
    })
    .catch(error => {
      Notify.failure(refs.error.textContent);
      changeVisibility(refs.loader);
      refs.catInfo.innerHTML = '';
    });
}

function renderMarkupInfo(data) {
  const { breeds, url } = data[0];
  const { name, temperament, description } = breeds[0];
  const markup = `<div class="cat-card">
    <img class="cat-image" src="${url}" alt="${name}">
    <div class="cat-content">
        <h2 class="cat-title">${name}</h2>
        <p class="cat-description"><strong>Description:</strong> ${description}</p>
        <p class="cat-temperament"><strong>Temperament:</strong> ${temperament}</p>
    </div>
</div>`;

  refs.catInfo.innerHTML = markup;
}

function renderOptionsList(data) {
  const optionsList = data
    .map(({ id, name }) => ` <option value="${id}">${name}</option>`)
    .join('');
  refs.select.innerHTML = optionsList;
  new SlimSelect({
    select: refs.select,
  });
}

function changeVisibility(el) {
  el.classList.toggle('hidden');
}

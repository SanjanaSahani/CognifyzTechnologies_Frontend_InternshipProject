const API_URL = 'https://boozeapi.com/api/v1/cocktails';
const cocktailList = document.getElementById('cocktailList');
const categorySelect = document.getElementById('categorySelect');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalInstructions = document.getElementById('modalInstructions');
const modalIngredients = document.getElementById('modalIngredients');

const DarkButton = document.getElementById('dark-button');
const LightButton = document.getElementById('light-button');
const allParagraphs = document.querySelectorAll('p'); 
const Heading = document.querySelector('h2')

DarkButton.onclick = function() {
    document.body.style.backgroundColor = "black";
    console.log("black");
    
};

LightButton.onclick = function() {
    document.body.style.backgroundColor = "white";
     console.log("white");
};

let cocktails = [];

async function fetchCocktails() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    cocktails = json.data;
    renderCategories(cocktails);
    renderCocktails(cocktails);
  } catch (error) {
    cocktailList.innerHTML = '<p>Failed to load cocktails. Try again later.</p>';
  }
}

function renderCategories(data) {
  const categories = [...new Set(data.map(c => c.category.label))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  categorySelect.addEventListener('change', (e) => {
    const value = e.target.value;
    const filtered = value === 'all' ? cocktails : cocktails.filter(c => c.category.label === value);
    renderCocktails(filtered);
  });
}

function renderCocktails(data) {
  cocktailList.innerHTML = '';
  data.forEach(cocktail => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${cocktail.image}" alt="${cocktail.name}">
      <div class="card-body">
        <h3>${cocktail.name}</h3>
        <p>${cocktail.category.label}</p>
      </div>
    `;

    card.addEventListener('click', () => openModal(cocktail));
    cocktailList.appendChild(card);
  });
}

function openModal(cocktail) {
  modalTitle.textContent = cocktail.name;
  modalImg.src = cocktail.image;
  modalInstructions.textContent = cocktail.instructions;
  modalIngredients.innerHTML = '';
  cocktail.ingredients.forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing.name + (ing.ABV ? ` (${ing.ABV}% ABV)` : '');
    modalIngredients.appendChild(li);
  });
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

fetchCocktails();

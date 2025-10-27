const API_URL = 'https://boozeapi.com/api/v1/cocktails';

const cocktailList = document.getElementById('cocktailList');
const categorySelect = document.getElementById('categorySelect');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalInstructions = document.getElementById('modalInstructions');
const modalIngredients = document.getElementById('modalIngredients');

const darkButton = document.getElementById('dark-button');
const lightButton = document.getElementById('light-button');

darkButton.onclick = function() {
  document.body.classList.add('active'); // Activate dark mode
  console.log("Dark Mode ON");
};

lightButton.onclick = function() {
  document.body.classList.remove('active'); // Back to light mode
  console.log("Light Mode ON");
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cocktailForm");
  const successMsg = document.getElementById("formSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    successMsg.style.display = "none"; // reset success message

    // Validate each field
    const fields = form.querySelectorAll("[required]");
    fields.forEach((field) => {
      const errorMessage = field.nextElementSibling;
      if (field.value.trim() === "") {
        errorMessage.textContent = "This field is required.";
        errorMessage.style.display = "block";
        field.style.borderColor = "red";
        isValid = false;
      } else {
        // Email validation
        if (field.type === "email" && !validateEmail(field.value)) {
          errorMessage.textContent = "Please enter a valid email address.";
          errorMessage.style.display = "block";
          field.style.borderColor = "red";
          isValid = false;
        } else {
          errorMessage.textContent = "";
          errorMessage.style.display = "none";
          field.style.borderColor = "#ccc";
        }
      }
    });

    if (isValid) {
      successMsg.textContent = "🎉 Thank you! Your cocktail recipe has been submitted.";
      successMsg.style.display = "block";
      form.reset();
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});


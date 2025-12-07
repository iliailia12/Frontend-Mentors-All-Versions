const customSelect = document.getElementById('custom-select');
const darkModeButton = document.getElementById('dark-mode-button');
const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const trigger = customSelect.querySelector('.custom-select__trigger');
const options = customSelect.querySelector('.custom-select__options');
const optionItems = options.querySelectorAll('li');
const triggerSpan = trigger.querySelector("span");

const searchInput = document.getElementById("search-bar");

const flagContainer = document.getElementById("flag-container");
const detailsContainer = document.getElementById("details-container");

trigger.addEventListener('click', () => {
  customSelect.classList.toggle('open');
});

optionItems.forEach(option => {
  option.addEventListener('click', () => {
    if (option.dataset.value === "") {
      triggerSpan.textContent = "Filter by Region"; 
      trigger.dataset.value = "";
    } else {
      triggerSpan.textContent = option.textContent;
      trigger.dataset.value = option.dataset.value;
    }
  loadData();
  customSelect.classList.remove('open');
  });
});



document.addEventListener('click', e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove('open');
  }
});

darkModeButton.addEventListener('click', function() {

  const isDark = document.body.classList.toggle("dark-mode"); 

  localStorage.setItem("theme", isDark ? "dark" : "light");

  darkIcon.classList.toggle("hide", !isDark);
  lightIcon.classList.toggle("hide", isDark);

});

function loadTheme() {

  const theme = localStorage.getItem("theme");
  
  if (theme === "dark") {
    document.documentElement.style.setProperty('--transition', 'none');
    document.body.classList.add("dark-mode");
    darkIcon.classList.remove("hide");
    lightIcon.classList.add("hide");
  }

  void document.body.offsetWidth;

  document.documentElement.style.setProperty('--transition', 'background-color 0.3s ease, color 0.3s ease');
}

function loadData() {

  const flagGrid = document.getElementById("flag-grid");
  flagGrid.innerHTML = "";
  
  const selectedFilter = trigger.dataset.value;
  console.log("selectedFilter: ", selectedFilter);

  const searchQuery = searchInput.value.toLowerCase().trim();
  
  fetch("./data/data.json")
    .then(response => response.json())
    .then(data => {
      
      data.forEach(country => {

        if(!selectedFilter || selectedFilter === country.region) {

          if(!searchQuery || country.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            
            const flagItem = document.createElement("a");
            flagItem.href = `index.html?country=${country.name}`;
            flagItem.classList.add("flag__box");
            flagItem.innerHTML = `
                
                  <div class="flag__img-container">
                    <img class="flag__img" src="${country.flags.svg}" alt="">
                  </div>
                  <div class="flag__contents flex column">
                      <h2 class="heading-2">${country.name}</h2>
                      <dl class="flag__details flex column">
                          <div>
                              <dt>Population:</dt>
                              <dd>${country.population.toLocaleString()}</dd>
                          </div>
                          <div>
                              <dt>Region:</dt>
                              <dd>${country.region}</dd>
                          </div>
                          <div>
                              <dt>Capital:</dt>
                              <dd>${country.capital}</dd>
                          </div>
                      </dl>
                  </div>
              `;

              flagGrid.appendChild(flagItem);
              void flagItem.offsetWidth;
              flagItem.classList.add("visible");

          }
        }
      });
    })
  .catch(error => console.error("Error loading JSON:", error));
}

searchInput.addEventListener("input", loadData);

function getCountryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country");
}

function showCountryDetails(country, data) {

  const detailsGrid = detailsContainer.querySelector(".details__grid");
  flagContainer.classList.add("hide");
  detailsContainer.classList.remove("hide");

  console.log("country details selected", country);

  const currencies = country.currencies ? country.currencies
  .map(curr => curr.name)
  .join(", ") : "None";

  const languages = country.languages ? country.languages
  .map(lang => lang.name)
  .join(", ") : "None";

  const borderCountries = getBorderCountryNames(country.borders || [], data);

  const borderLinksHTML = borderCountries.length > 0
  ? borderCountries.map(name => 
      `<a class="country-button" href="index.html?country=${encodeURIComponent(name)}">${name}</a>`
    ).join("")
  : `<span>None</span>`;

  console.log("border countries", borderCountries);

  detailsGrid.innerHTML = `
    <div class="details__flag-container">
            <img src="${country.flags.svg}" alt="">
            </div>
            <div>
                <h2 class="heading-1">${country.name}</h2>
                <div class="details__stats-grid grid">
                    <dl class="stats-grid-col">
                        <div>
                          <dt>Native Name:</dt>
                          <dd class="fw-300">${country.nativeName}</dd>
                        </div>
                        <div>
                          <dt>Population:</dt>
                          <dd class="fw-300">${country.population.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt>Region:</dt>
                          <dd class="fw-300">${country.region}</dd>
                        </div>
                        <div>
                          <dt>Sub Region:</dt>
                          <dd class="fw-300">${country.subregion}</dd>
                        </div>
                        <div>
                          <dt>Capital:</dt>
                          <dd class="fw-300">${country.capital}</dd>
                        </div>
                    </dl>
                    <dl class="stats-grid-col">
                        <div>
                          <dt>Top Level Domain:</dt>
                          <dd class="fw-300">${country.nativeName}</dd>
                        </div>
                        <div>
                          <dt>Currencies:</dt>
                          <dd class="fw-300">${currencies}</dd>
                        </div>
                        <div>
                          <dt>Languages:</dt>
                          <dd class="fw-300">${languages}</dd>
                        </div>
                    </dl>
                </div>
                <div class="details__border-countries-wrap flex">
                  <span>Border Countries: </span>
                  ${borderLinksHTML}
                </div>
            </div>`
}

function getBorderCountryNames(borderCodes, data) {
  return borderCodes.map(code => {
    const match = data.find(c => c.alpha3Code === code);
    return match ? match.name : code;
  });
}

document.addEventListener('DOMContentLoaded', function() {

  loadTheme();


  
  const countryParam = getCountryFromUrl();

  if (countryParam) {
    
    fetch("./data/data.json")
      .then(response => response.json())
      .then(data => {

        const country = data.find(
          c => c.name.toLowerCase() === countryParam.toLowerCase()
        );

        if (country) showCountryDetails(country, data);
      });
  } else {
    loadData();
  }

});


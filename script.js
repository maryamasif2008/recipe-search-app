 const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    const resultDiv = document.getElementById("result");
    const spinner = document.getElementById("spinner");
    const randomBtn = document.getElementById("random-btn");
    const toggleMode = document.getElementById("toggle-mode");
    const categoryFilter = document.getElementById("category-filter");
    const favoritesDiv = document.getElementById("favorites");

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = input.value.trim();
      if (searchTerm !== "") {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      }
    });

    randomBtn.addEventListener("click", () => {
      fetchRecipes("https://www.themealdb.com/api/json/v1/1/random.php", true);
    });

    categoryFilter.addEventListener("change", () => {
      const category = categoryFilter.value;
      if (category !== "") {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`, false, true);
      }
    });

    toggleMode.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    function fetchRecipes(url, isRandom = false, isFilter = false) {
      resultDiv.innerHTML = "";
      spinner.classList.remove("hidden");

      fetch(url)
        .then(res => res.json())
        .then(data => {
          spinner.classList.add("hidden");
          const meals = data.meals;
          if (!meals) {
            resultDiv.innerHTML = `<p>No recipes found.</p>`;
            return;
          }

          resultDiv.innerHTML = meals.map(meal => createCard(meal, isFilter)).join("");
        })
        .catch(err => {
          spinner.classList.add("hidden");
          resultDiv.innerHTML = `<p>Error loading data.</p>`;
        });
    }

    function createCard(meal, isFilter) {
      const id = meal.idMeal;
      const title = meal.strMeal;
      const img = meal.strMealThumb;
      const link = meal.strSource || meal.strYoutube || "#";
      const favorite = favorites.find(fav => fav.id === id);

      return `
        <div class="card">
          <img src="${img}" alt="${title}" />
          <h3>${title}</h3>
          <a href="${link}" target="_blank">View Recipe</a>
          <br />
          <button onclick='addToFavorites(${JSON.stringify({ id, title, img, link })})'>${favorite ? "✅ Saved" : "★Save"}</button>
        </div>
      `;
    }

    function addToFavorites(meal) {
      if (!favorites.find(f => f.id === meal.id)) {
        favorites.push(meal);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showFavorites();
      }
    }

    function showFavorites() {
      favoritesDiv.innerHTML = favorites.map(meal => `
        <div class="card">
          <img src="${meal.img}" alt="${meal.title}" />
          <h3>${meal.title}</h3>
          <a href="${meal.link}" target="_blank">View Recipe</a>
        </div>
      `).join("");
    }

    // On Load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
    showFavorites();
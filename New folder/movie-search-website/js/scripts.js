// scripts.js

const apiKey = 'AIzaSyBbekkoIpn-15yphg3rtdle6dDrtNftzMU'; // Replace with your actual Google API key
const searchEngineId = 'a35ddea1b69a24e20'; // Replace with your actual Search Engine ID
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('movie-list');
const recentReleasesContainer = document.getElementById('recent-movie-list');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
const currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

document.addEventListener('DOMContentLoaded', () => {
    fetchRecentReleases();
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        fetchMovies(query);
    }
});

themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    setTheme(newTheme);
});

async function fetchMovies(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`);
        const data = await response.json();
        displayResults(data.items, resultsContainer);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function fetchRecentReleases() {
    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=recent+movie+releases`);
        const data = await response.json();
        displayResults(data.items, recentReleasesContainer);
    } catch (error) {
        console.error('Error fetching recent releases:', error);
    }
}

function displayResults(items, container) {
    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }
    items.forEach(item => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        // Check if an image exists in the API response
        const imageUrl = item.pagemap && item.pagemap.cse_image 
                         ? item.pagemap.cse_image[0].src 
                         : 'https://via.placeholder.com/100'; // Placeholder if no image is available

        movieElement.innerHTML = `
            <img src="${imageUrl}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.snippet}</p>
            <a href="${item.link}" target="_blank">View More</a>
        `;

        // Apply current theme to new movie elements
        if (body.classList.contains('light-theme')) {
            movieElement.classList.add('light-theme');
        }

        container.appendChild(movieElement);
    });
}

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        themeToggle.textContent = '🌙 Switch to Dark';
    } else {
        body.classList.remove('light-theme');
        themeToggle.textContent = '☀️ Switch to Light';
    }
    localStorage.setItem('theme', theme); // Save theme preference
}

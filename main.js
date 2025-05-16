// --- MARKERA AKTUELL SIDA I NAVIGATION ---
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('nav ul li a');
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        let linkHref = link.getAttribute('href');

        if ((currentPage === "" || currentPage === "index.html") && (linkHref === "index.html" || linkHref === "/")) {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
});

// --- GLOBALA VARIABLER ---
let events = [];
let currentDate = new Date();

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city');
const dateInput = document.getElementById('date');
const genreInput = document.getElementById('genre');
const resultsContainer = document.getElementById('results-container');
const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// --- SÖKFORMULÄR ---
searchForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedCity = cityInput.value.toLowerCase();
    const selectedDate = dateInput.value;
    const selectedGenre = genreInput.value.toLowerCase();

    let params = [];
    if (selectedCity) params.push(`city=${encodeURIComponent(selectedCity)}`);
    if (selectedDate) params.push(`date=${encodeURIComponent(selectedDate)}`);
    if (selectedGenre) params.push(`genre=${encodeURIComponent(selectedGenre)}`);

    const queryParams = params.join('&');
    window.location.href = `events.html?${queryParams}`;
});

// --- HÄMTA URL-PARAMETRAR ---
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// --- VISA RESULTAT ---
function displayResults(events) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = "";

    if (events.length === 0) {
        resultsContainer.innerHTML = "<p>Inga evenemang hittades för de valda kriterierna.</p>";
        return;
    }

    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event-poster');
        eventDiv.innerHTML = `
            <img src="${event.image}" alt="${event.name}" class="event-image">
            <h3>${event.name}</h3>
            <p><strong>Datum:</strong> ${event.date} | <strong>Plats:</strong> ${event.city}</p>
            <p>${event.description}</p>
        `;
        resultsContainer.appendChild(eventDiv);
    });
}

// --- FILTRERA EVENT FRÅN URL ---
function filterEvents() {
    const selectedCity = getUrlParameter('city');
    const selectedDate = getUrlParameter('date');
    const selectedGenre = getUrlParameter('genre');

    const filteredEvents = events.filter(event => {
        const isCityMatch = selectedCity ? event.city.toLowerCase() === selectedCity : true;
        const isDateMatch = selectedDate ? event.date === selectedDate : true;
        const isGenreMatch = selectedGenre ? event.genre.toLowerCase() === selectedGenre : true;
        return isCityMatch && isDateMatch && isGenreMatch;
    });

    displayResults(filteredEvents);
}

// --- RITA KALENDER ---
function renderCalendar() {
    if (!daysContainer) return;

    daysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        daysContainer.appendChild(emptyDiv);
    }

    for (let date = 1; date <= lastDate; date++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = date;
        dayDiv.classList.add("calendar-day");

        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const todaysEvents = events.filter(event => event.date === fullDate);

        if (todaysEvents.length > 0) {
            dayDiv.classList.add("event-day");
            const eventDot = document.createElement('span');
            eventDot.classList.add("event-dot");
            dayDiv.appendChild(eventDot);
        }

        dayDiv.addEventListener('click', () => {
            showEventsForDate(fullDate);
        });

        daysContainer.appendChild(dayDiv);
    }
}

// --- VISA EVENT FÖR ETT DATUM ---
function showEventsForDate(date) {
    const eventsOnDate = events.filter(event => event.date === date);
    displayResults(eventsOnDate);
}

// --- KALENDER KNAPPAR ---
prevButton?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});
nextButton?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// --- HÄMTA EVENTS FRÅN JSON ---
fetch('events.json')
    .then(response => {
        if (!response.ok) throw new Error('Kunde inte ladda events.json');
        return response.json();
    })
    .then(data => {
        events = data;
        filterEvents();
        renderCalendar();
    })
    .catch(error => {
        console.error('Fel vid inläsning av events:', error);
        if (resultsContainer) {
            resultsContainer.innerHTML = "<p>Misslyckades med att ladda evenemangen. Försök igen senare.</p>";
        }
    });

// --- KONTAKTFORMULÄR ---
const form = document.getElementById('contact-form');
const responseMessage = document.getElementById('response-message');

form?.addEventListener('submit', function (formEvent) {
    formEvent.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const type = document.getElementById('type')?.value;
    const message = document.getElementById('message')?.value;

    if (!name || !email || !type || !message) {
        responseMessage.textContent = 'Vänligen fyll i alla fält!';
        responseMessage.style.color = 'red';
        return;
    }

    const formData = { name, email, type, message };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Något gick fel vid skickandet av formuläret.');
        })
        .then(data => {
            responseMessage.textContent = `Tack för din förfrågan, ${name}! Vi återkommer till dig via ${email}.`;
            responseMessage.style.color = 'green';
            console.log('Serverns svar:', data);
            form.reset();
        })
        .catch(error => {
            console.error('Fel:', error);
            responseMessage.textContent = 'Ett fel uppstod vid skickandet av din förfrågan. Försök igen senare.';
            responseMessage.style.color = 'red';
        });
});

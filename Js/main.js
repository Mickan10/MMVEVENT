//Vilken sida man är på
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('nav ul li a');

    // Hämta den aktuella sidan (filnamnet från URL:en)
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        let linkHref = link.getAttribute('href');

        // Hantera startsidan och andra sidor korrekt
        if ((currentPage === "" || currentPage === "index.html") && (linkHref === "index.html" || linkHref === "/")) {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
});





// evenamng sökdunktioner 
//sortera på genre, stad och datum

// 1. Evenemangsdata och variabler
let events = [
    { name: "Rock Night", date: "2025-05-10", city: "skövde", genre: "rock", description: "En kväll fylld med rockmusik från lokala band.", image: "Bilder/20241205_233217_540767.jpg" },
    { name: "Pop Festival", date: "2025-05-15", city: "skövde", genre: "pop", description: "Sveriges största popfestival med internationella artister.", image: "Bilder/20241207_215011_972979.jpg" },
    { name: "Metal Madness", date: "2025-05-01", city: "skövde", genre: "metal", description: "En brutal kväll med de bästa metalbanden.", image: "Bilder/20241201_000118_24720.jpg" }
];

let currentDate = new Date();

// 2. Hämta formulär och inputfält
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city');
const dateInput = document.getElementById('date');
const genreInput = document.getElementById('genre');
const resultsContainer = document.getElementById('results-container');
const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// 3. Hantera formens submit (sök)
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedCity = cityInput.value.toLowerCase();
    const selectedDate = dateInput.value;
    const selectedGenre = genreInput.value.toLowerCase();

    // Skapa URL-parametrar
    let queryParams = '';
    if (selectedCity) queryParams += `city=${encodeURIComponent(selectedCity)}`;
    if (selectedDate) queryParams += queryParams ? `&date=${encodeURIComponent(selectedDate)}` : `date=${encodeURIComponent(selectedDate)}`;
    if (selectedGenre) queryParams += queryParams ? `&genre=${encodeURIComponent(selectedGenre)}` : `genre=${encodeURIComponent(selectedGenre)}`;

    // Skicka användaren till events.html med parametrar
    window.location.href = `events.html?${queryParams}`;
});

// 4. Funktion för att hämta URL-parameter (t.ex. stad, datum, genre från URL)
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 5. Funktion för att visa resultaten
function displayResults(events) {
    resultsContainer.innerHTML = ""; // Rensa tidigare resultat

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

// 6. Filtrera och visa resultaten baserat på URL-parametrarna
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

// 7. När sidan är laddad, filtrera och visa evenemang baserat på URL-parametrarna
window.onload = function () {
    filterEvents();
    renderCalendar();
};

// 8. Funktion för att rendera kalendern
function renderCalendar() {
    daysContainer.innerHTML = ""; // Rensa dagar

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Lägg till tomma rutor för att justera startdagarna
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        daysContainer.appendChild(emptyDiv);
    }

    // Lägg till dagar
    for (let date = 1; date <= lastDate; date++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = date;
        dayDiv.classList.add("calendar-day");

        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const todaysEvents = events.filter(event => event.date === fullDate);

        if (todaysEvents.length > 0) {
            dayDiv.classList.add("event-day"); // Markera eventdag

            const eventDot = document.createElement('span');
            eventDot.classList.add("event-dot");
            dayDiv.appendChild(eventDot);
        }

        // Klickhändelse för att visa event på sidan
        dayDiv.addEventListener('click', () => {
            showEventsForDate(fullDate);
        });

        daysContainer.appendChild(dayDiv);
    }

    // Navigera mellan månader
    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1); // Minska månaden med 1
        renderCalendar(); // Rendera kalendern på nytt
    });
    
    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1); // Öka månaden med 1
        renderCalendar(); // Rendera kalendern på nytt
    });
}

// 9. Funktion för att visa event för ett specifikt datum
function showEventsForDate(date) {
    const eventsOnDate = events.filter(event => event.date === date);
    displayResults(eventsOnDate);
}






// Formulär

// Koppla till formuläret
const form = document.getElementById('contact-form');

// Koppla till svarsmeldelande-diven
const responseMessage = document.getElementById('response-message');

// Lägg till en händelsehanterare för "submit"
form.addEventListener('submit', function (formEvent) {
    formEvent.preventDefault(); // Förhindrar sidomladdning vid formulärskick

    // Hämta data från formuläret
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const type = document.getElementById('type').value;
    const message = document.getElementById('message').value;

    // Kontrollera att all data är ifylld (validering)
    if (!name || !email || !type || !message) {
        responseMessage.textContent = 'Vänligen fyll i alla fält!';
        responseMessage.style.color = 'red';
        return;
    }

    // Skapa ett objekt med formulärdata
    const formData = { name, email, type, message };

    // Skicka data med fetch till en låtsas server
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Något gick fel vid skickandet av formuläret.');
        })
        .then(data => {
            // Visa framgångsmeddelande
            responseMessage.textContent = `Tack för din förfrågan, ${name}! Vi återkommer till dig via ${email}.`;
            responseMessage.style.color = 'green';
            console.log('Serverns svar:', data);
            form.reset(); // Rensa formuläret efter att det skickats
        })
        .catch(error => {
            // Hantera fel
            console.error('Fel:', error);
            responseMessage.textContent = 'Ett fel uppstod vid skickandet av din förfrågan. Försök igen senare.';
            responseMessage.style.color = 'red';
        });
});


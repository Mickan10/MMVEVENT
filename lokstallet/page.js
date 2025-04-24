
//scrolla galleri
let currentIndex = 0;

function moveSlide(direction) {
    const gallery = document.querySelector('.gallery');
    const totalImages = document.querySelectorAll('.gallery img').length;
    const visibleImages = 3; // Antal synliga bilder
    const maxIndex = totalImages - visibleImages;

    // Uppdatera aktuell index baserat på riktning
    currentIndex += direction;

    // Begränsa index inom intervallet 0 till maxIndex
    if (currentIndex < 0) {
        currentIndex = maxIndex; // Gå till sista "set" av bilder
    } else if (currentIndex > maxIndex) {
        currentIndex = 0; // Gå tillbaka till början
    }

    // Flytta galleriet
    const translateX = -(currentIndex * (100 / visibleImages)); // Flytta en bild i taget
    gallery.style.transform = `translateX(${translateX}%)`;
}

//pilar för att ändra lokalbilder
document.addEventListener('DOMContentLoaded', function () {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => moveSlide(-1));
        nextButton.addEventListener('click', () => moveSlide(1));
    } else {
        console.error("Något gick fel: Knapp-ID:t hittades inte!");
    }
});



//Formuläret lokstallet
document.addEventListener('DOMContentLoaded', function () {
    const priceOutput = document.getElementById('priceOutput');
    const goToStep2 = document.getElementById('goToStep2');
    const step2 = document.getElementById('step2');
    const goToStep3 = document.getElementById('goToStep3');
    const step3 = document.getElementById('step3');
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    const submitForm = document.getElementById('submitForm');
    const bookingDate = document.getElementById('bookingDate');
    const customerType = document.getElementById('customerType');
    const eventType = document.getElementById('eventType');
    const otherEventDescription = document.getElementById('otherEventDescription');
    const otherEventSection = document.getElementById('otherEvent');

    // Funktion för att uppdatera sammanfattningen
    function updateSummary() {
        let local = document.getElementById('local').value;
        let eventTypeValue = eventType.value;
        let audioTech = document.getElementById('audioTech').value;
        let lightTech = document.getElementById('lightTech').value;
        let ticketSales = document.getElementById('ticketSales').value;
        let catering = document.getElementById('catering').value;
        let extraPersonnel = document.getElementById('extraPersonnel').value || "0";
        let date = bookingDate.value || "Ej valt";
        let price = priceOutput.textContent;
        let eventDescription = eventTypeValue === "annat" ? otherEventDescription.value : "Ej valt";

        summaryContent.innerHTML = `
            <p><strong>Lokal:</strong> ${local || "Ej valt"}</p>
            <p><strong>Evenemangstyp:</strong> ${eventTypeValue || "Ej valt"}</p>
            <p><strong>Beskrivning av evenemang:</strong> ${eventDescription}</p>
            <p><strong>Ljudtekniker:</strong> ${audioTech}</p>
            <p><strong>Ljustekniker:</strong> ${lightTech}</p>
            <p><strong>Extra personal:</strong> ${extraPersonnel}</p>
            <p><strong>Biljettförsäljning:</strong> ${ticketSales}</p>
            <p><strong>Catering:</strong> ${catering}</p>
            <p><strong>Datum:</strong> ${date}</p>
            <p><strong>${price}</strong></p>
        `;

        summarySection.style.display = 'block';
    }

    // Beräkna pris
    document.getElementById('calculatePrice').addEventListener('click', function () {
        let totalPrice = 0;
        let local = document.getElementById('local').value;

        if (!local) {
            alert("Vänligen välj en lokal innan du går vidare.");
            return;
        }

        let audioTech = document.getElementById('audioTech').value;
        let lightTech = document.getElementById('lightTech').value;
        let ticketSales = document.getElementById('ticketSales').value;
        let catering = document.getElementById('catering').value;
        let extraPersonnel = parseInt(document.getElementById('extraPersonnel').value) || 0;

        const localPrices = {
            'köket': 1000,
            'lillaScenen': 2000,
            'storaScenen': 5000,
            'konferensrum': 1500,
            'helaLokalen': 7000,
            'dagskontor': 800
        };

        if (localPrices[local]) totalPrice += localPrices[local];
        if (audioTech === 'ja') totalPrice += 1500;
        if (lightTech === 'ja') totalPrice += 1200;
        totalPrice += extraPersonnel * 500;
        if (catering === 'ja') totalPrice += 2000;
        if (ticketSales === 'ja') totalPrice += 1000;

        priceOutput.textContent = 'Totalpris: ' + totalPrice.toLocaleString() + ' SEK';
        goToStep2.style.display = 'block';
    });

    // Gå vidare till steg 2
    goToStep2.addEventListener('click', function () {
        step2.style.display = 'block';
        goToStep2.style.display = 'none';
    });

    // Gå vidare till steg 3
    goToStep3.addEventListener('click', function () {
        let date = bookingDate.value;
        if (!date) {
            alert("Vänligen välj ett datum innan du går vidare.");
            return;
        }
        step3.style.display = 'block';
        step2.style.display = 'none';
        updateSummary();
    });

    // Validering vid formulärsändning
    submitForm.addEventListener('click', function () {
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let type = customerType.value;
        let orgNumber = document.getElementById('orgNumber').value;
        let phone = document.getElementById('phone').value;

        // Validera att alla obligatoriska fält är ifyllda
        if (!name || !email || !type || !orgNumber || !phone) {
            alert("Vänligen fyll i alla fält innan du skickar din förfrågan.");
            return;
        }

        // Extra validering kan läggas till för t.ex. telefonnummer eller organisationsnummer
        alert("Tack för din förfrågan! Vi återkommer snart.");
    });

    // Visa fritextrutan när "Annat" är valt i evenemangstypen
    eventType.addEventListener('change', function () {
        if (eventType.value === 'annat') {
            otherEventSection.style.display = 'block';
        } else {
            otherEventSection.style.display = 'none';
        }
    });
});



//LOKAL-sidan
document.addEventListener("DOMContentLoaded", function () {
    const slideshows = document.querySelectorAll(".slideshow");

    slideshows.forEach((slideshow) => {
        let slides = slideshow.querySelectorAll("img");
        let index = 0;

        function showNextImage() {
            slides[index].classList.remove("active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("active");
        }

        setInterval(showNextImage, 2000);
    });
});


// POP-UP rutor formulär (mer information)



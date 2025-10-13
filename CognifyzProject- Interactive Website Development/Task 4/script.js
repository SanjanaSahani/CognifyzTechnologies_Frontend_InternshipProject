const DarkButton = document.getElementById('dark-button');
const LightButton = document.getElementById('light-button');
const allParagraphs = document.querySelectorAll('p'); 
const Heading = document.querySelector('h2')

DarkButton.onclick = function() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    allParagraphs.forEach(p => {
        p.style.color = "white";
    });
    Heading.style.color = "white";
};

LightButton.onclick = function() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    allParagraphs.forEach(p => {
        p.style.color = "black";
    });
};

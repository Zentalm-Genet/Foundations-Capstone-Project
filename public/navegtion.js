const taskListLink = document.getElementById('task-list-link');
const taskCompleteLink = document.getElementById('task-complete-link');
const taskCreationLink = document.getElementById('task-creation-link');
const sections = document.querySelectorAll('.sub-main section');
const nav = document.querySelector('nav');
const subMain = document.querySelector('.sub-main');

function toggleNav() {
    nav.classList.toggle('nav-open');
    subMain.classList.toggle('active');

    if (window.innerWidth < 525) {
        if (nav.classList.contains('nav-open')) {
            subMain.style.marginTop = '0';
            document.body.style.overflowY = 'hidden'; 
        } else {
            subMain.style.marginTop = '4rem'; 
            document.body.style.overflowY = 'auto'; 
        }
    } else {
        if (nav.classList.contains('nav-open')) {
            subMain.style.marginLeft = '250px'; 
            document.body.style.overflowY = 'hidden'; 
        } else {
            subMain.style.marginLeft = '0';
            document.body.style.overflowY = 'auto'; 
        }
    }
}

function displaySections(exceptSectionId) {
    sections.forEach((section) => {
        if (section.id === exceptSectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

displaySections('task-list');

taskListLink.addEventListener('click', (event) => {
    event.preventDefault();
    displaySections('task-list');
    if (window.innerWidth < 525) toggleNav(); // Close nav on smaller screens
});

taskCompleteLink.addEventListener('click', (event) => {
    event.preventDefault();
    displaySections('task-complete');
    if (window.innerWidth < 525) toggleNav(); 
});

taskCreationLink.addEventListener('click', (event) => {
    event.preventDefault();
    displaySections('task-creation');
    if (window.innerWidth < 525) toggleNav(); 
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 525) {
        subMain.style.marginLeft = '0';
        subMain.style.marginTop = '0'; 
        document.body.style.overflowY = 'auto'; 
    }
});

function showCustomAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    const okayButton = document.getElementById('custom-alert-okay');

    alertMessage.textContent = message;
    customAlert.style.display = 'block';
    okayButton.addEventListener('click', function() {
        customAlert.style.display = 'none';
    });
}
// Get reference to the add button
const addButton = document.getElementById('add-button');
function showTaskCreationSection() {
    displaySections('task-creation');
}
addButton.addEventListener('click', showTaskCreationSection);


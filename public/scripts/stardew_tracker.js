// making button bigger and lighter colored when hovering

function changeImageOnHover(imgElement, newSrc, newWidth, newHeight) {
    const originalSrc = imgElement.src;
    const originalWidth = imgElement.width;
    const originalHeight = imgElement.height;

    imgElement.addEventListener('mouseover', () => {
        imgElement.src = newSrc;
        imgElement.width = newWidth;
        imgElement.height = newHeight;
    });

    imgElement.addEventListener('mouseout', () => {
        imgElement.src = originalSrc;
        imgElement.width = originalWidth;
        imgElement.height = originalHeight;
    });
}

document.querySelectorAll('.main img').forEach(img => {
    const season = img.alt;
    const newSrc = `images/${season}_button_on.png`;
    changeImageOnHover(img, newSrc, 175, 175);
});

// animation for clicking buttons

const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('clicked');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('clicked');
    });

    button.addEventListener('mouseleave', () => {
        button.classList.remove('clicked');
    });
});

// changing background

const lightDarkButton = document.querySelector('#light_dark');

const backgroundImages = [
    "url('../images/stardew\ day\ 1920x1080.png')",
    "url('../images/stardew_valley_night.png')"
];

let currentBackground = 0;

function toggleBackground() {
    currentBackground = (currentBackground + 1) % backgroundImages.length;
    document.body.style.backgroundImage = backgroundImages[currentBackground];

    if (currentBackground === 0) {
        lightDarkButton.innerHTML = "&#x2600";
    } else {
        lightDarkButton.innerHTML = "&#x1F319";
    }
}

lightDarkButton.addEventListener('click', toggleBackground);

// opening checklists

const checklists = document.querySelectorAll('.checklists > div');
const backArrow = document.getElementById('back_arrow');

buttons.forEach(button => {
    button.addEventListener('click', async () => {
        console.log('Button clicked:', button.id);
        checklists.forEach(checklist => {
            backArrow.classList.add('checklist_hidden');
            checklist.classList.add('checklist_hidden');
        });

        const season = button.id;
        const checklistId = `${season}_checklist`;
        const checklist = document.getElementById(checklistId);

        if(checklist) {
            backArrow.classList.remove('checklist_hidden');
            checklist.classList.remove('checklist_hidden');

            const items = await fetchItems(season);
            populateChecklist(season, items);
        }

        hideButtons();
    });
});

// back arrow functionality to return to main buttons

backArrow.addEventListener('click', () => {
    checklists.forEach(checklist => {
        backArrow.classList.add('checklist_hidden');
        checklist.classList.add('checklist_hidden');
    });
    showButtons();
});

// function to show buttons

function showButtons() {
    buttons.forEach(button => {
        button.style.display = "block";
    });
}

// hiding buttons when clicked on

function hideButtons() {
    buttons.forEach(button => {
        if (button.style.display === "none") {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
}

// code for login page

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.getElementById('log_in');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
    document.querySelector('.wrapper').style.marginTop='300px';
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
    document.querySelector('.wrapper').style.marginTop='225px';
});

btnPopup.addEventListener('click', () => {
    if (!(wrapper.classList.contains('active-popup'))) {
        hideButtons();
    }
    wrapper.classList.add('active-popup');
});

// Function to fetch items based on season

async function fetchItems(season) {
    try {
        const response = await fetch(`/items?season=${season}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

// Function to populate the checklist table
function populateChecklist(season, items) {
    const checklistId = `${season}_checklist`;
    const table = document.querySelector(`#${checklistId} table`);

    table.innerHTML = `
        <tr>
            <th>Image</th>
            <th>Item</th>
            <th>Additional Info</th>
        </tr>
    `;

    items.forEach(item => {
        const row = document.createElement('tr');

        const itemCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = item._id;
        checkbox.checked = item.checked;
        checkbox.addEventListener('change', () => toggleItemChecked(item._id, checkbox.checked));
        const label = document.createElement('label');
        label.htmlFor = item._id;
        label.textContent = item.name;
        itemCell.appendChild(checkbox);
        itemCell.appendChild(label);

        const infoCell = document.createElement('td');
        infoCell.textContent = item.additionalInfo;

        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.name;
        img.style.height = "50px";
        img.style.width = "50px";
        imageCell.appendChild(img);

        row.appendChild(imageCell);
        row.appendChild(itemCell);
        row.appendChild(infoCell);
        table.appendChild(row);
    });
}

// Function to toggle item's checked status

async function toggleItemChecked(itemId, isChecked) {
    try {
        const response = await fetch(`/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ checked: isChecked })
        });
        if (!response.ok) {
            throw new Error('Failed to update item');
        }
    
        const updatedItem = await response.json();
        console.log('Updated item:', updatedItem);

    } catch (error) {
        console.error('Error updating item:', error);
    }
}
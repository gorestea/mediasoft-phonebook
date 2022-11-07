const contacts = document.querySelector('.contacts');
const addcontactWindow = document.querySelector('.addcontact');

const contactList = document.querySelector('.contactlist');
const form = document.querySelector('.addcontact__form');

const addcontactbtn = document.querySelector('#addcontactbtn');
const closebtn = document.querySelector('#closebtn');

const inputName = document.querySelector('#name');
const inputPhone = document.querySelector('#phone');
const inputFavorite = document.querySelector('#favorite');
const inputSearch = document.querySelector('#search');

const maskOptions = {
    mask: '{8}(000)000-00-00'
}

let mask = IMask(inputPhone, maskOptions)



let list = [];

if (localStorage.getItem('contact')) {
    list = JSON.parse(localStorage.getItem('contact'));
    sortList();
    showContacts();
}

checkEmptyList();

function sortList() {
    list.sort((a, b) => {
        if (a.name > b.name) {
            return 1
        } else if (a.name < b.name) {
            return -1
        } else {
            return 0
        }
    });
}

function refresh() {
    elements = document.querySelectorAll('.contactlist__item');
    elements.forEach((el) => {
        el.remove();
    })
    sortList();
    showContacts();
}

function showContacts() {
    list.forEach(el => {
        updateContact(el);
    });
}

function openWindow () {
    contacts.classList.add('none');
    addcontactWindow.classList.remove('none');
}

function closeWindow() {
    contacts.classList.remove('none');
    addcontactWindow.classList.add('none');
}

function searchContact() {
    
    elements = document.querySelectorAll('.contactlist__item');
    
    let counter = 0;
    const noResults = document.querySelector('.contacts__nothing');

    if (inputSearch.value !== '') {
        counter = 0;
        elements.forEach((el) => {
            const name = el.querySelector('.contactlist__name')
            if (name.innerText.toLowerCase().search(inputSearch.value.toLowerCase()) == -1) {
                el.classList.add('none');
                counter++;
            } else {
                counter--;
                el.classList.remove('none');
            }
        })

        if (counter === list.length && list.length !== 0) { 
            noResults.classList.remove('none');
        } else {
            noResults.classList.add('none');
        }

    } else {
     
        noResults.classList.add('none');
        elements.forEach((el) => {
            el.classList.remove('none');
        })
    }
}

function addContact(event) {
    event.preventDefault();
    
    const valueName = inputName.value;
    const valuePhone = inputPhone.value;
    const valueFavorite = inputFavorite.checked;
    inputName.value = '';
    inputPhone.value = '';
    inputFavorite.checked = false;

    const newContact = {
        id: Date.now(),
        name: valueName,
        phone: valuePhone,
        favorite: valueFavorite
    }

    list.push(newContact);
    saveToLS();

    refresh();

    checkEmptyList();
    closeWindow();
}

function deleteContact(event) {
    if (event.target.id === 'delete') {
        const listItem = event.target.closest('.contactlist__item');


        list = list.filter((item) => item.id !== Number(listItem.id))

        saveToLS();
        listItem.remove();
        checkEmptyList()
    }  
}

function setFavorite(event) {
    if (event.target.id === 'favorite') {
        const listItem = event.target.closest('.contactlist__item');
        
        const item = list.find((item) => item.id === Number(listItem.id))

        item.favorite = !item.favorite;
        listItem.remove();
        
        saveToLS();
        refresh();

        const favoritebtn = event.target;
        favoritebtn.classList.toggle('change-btn--favorite');
    }
    
}

function saveToLS() {
    localStorage.setItem('contact', JSON.stringify(list))
}

function updateContact(contact) {
    
    const favoritePath = contact.favorite ? 'favorite-active.svg' : 'favorite.svg';
    const contactImg = contact.name[0];
    let itemCSSclass = 'contactlist__item';

    if (inputSearch.value != '') {
        if (contact.name.toLowerCase().search(inputSearch.value) === -1) {
            itemCSSclass = 'contactlist__item none'
        }
    }

    const listItemHTML = 
    `<div class="${itemCSSclass}" id="${contact.id}">
        <div class="contactlist__img">${contactImg}</div>
        <div class="contactlist__content">
            <div class="contactlist__info">
                <span class="contactlist__name">${contact.name}</span>
                <span class="contactlist__phone">${contact.phone}</span>
            </div>
            <div class="contactlist__btns">
                <button id="delete" class="contactlist__btn change-btn">
                    <img src="img/close.svg" alt="">
                </button>
                <button id="favorite" class="'contactlist__btn change-btn">
                    <img src="img/${favoritePath}" alt="">
                </button>
            </div>
        </div>
    </div>`;

    if (contact.favorite) {
        contactList.insertAdjacentHTML('afterbegin', listItemHTML)
    } else {
        contactList.insertAdjacentHTML('beforeend', listItemHTML)
    }
    
}

function checkEmptyList() {
    if (list.length === 0) {
        const emptyList = 
        `<div class="contacts__item-empty">
            <span>Телефонная книга пуста! \n
            Добавьте контакт</span>
        </div>`;
        contactList.insertAdjacentHTML('afterbegin', emptyList)
    } else if (document.querySelector('.contacts__item-empty')) {
        document.querySelector('.contacts__item-empty').remove();
    }
}

addcontactbtn.onclick = openWindow;

closebtn.onclick = closeWindow;

form.addEventListener('submit', addContact);

contactList.addEventListener('click', deleteContact);

contactList.addEventListener('click', setFavorite);

inputSearch.addEventListener('input', searchContact);
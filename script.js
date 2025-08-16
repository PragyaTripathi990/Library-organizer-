const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const booksContainer = document.getElementById('books-container');
const libraryContainer = document.getElementById('library-container');


let myLibrary = JSON.parse(localStorage.getItem('library')) || [];


async function fetchBooks(query) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const data = await response.json();
    displayBooks(data.items);
}


function displayBooks(books) {
    booksContainer.innerHTML = "";
    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookCard = document.createElement('div');
        bookCard.className = "book-card";
        bookCard.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/50'}" alt="Book Cover">
            <div>
                <h3>${bookInfo.title}</h3>
                <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}</p>
            </div>
            <button onclick="addToLibrary('${book.id}', '${bookInfo.title}', '${bookInfo.authors ? bookInfo.authors.join(', ') : ''}', '${bookInfo.imageLinks?.thumbnail || ''}')">Add</button>
        `;
        booksContainer.appendChild(bookCard);
    });
}


function addToLibrary(id, title, author, image) {
    if (!myLibrary.some(book => book.id === id)) {
        myLibrary.push({ id, title, author, image, progress: 0 });
        localStorage.setItem('library', JSON.stringify(myLibrary));
        displayLibrary();
    }
}


function displayLibrary() {
    libraryContainer.innerHTML = "";
    myLibrary.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = "book-card";
        bookCard.innerHTML = `
            <img src="${book.image || 'https://via.placeholder.com/50'}" alt="Book Cover">
            <div>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <input type="range" min="0" max="100" value="${book.progress}" onchange="updateProgress(${index}, this.value)">
                <span>${book.progress}% Read</span>
            </div>
            <button onclick="removeFromLibrary(${index})">Remove</button>
        `;
        libraryContainer.appendChild(bookCard);
    });
}


function updateProgress(index, progress) {
    myLibrary[index].progress = progress;
    localStorage.setItem('library', JSON.stringify(myLibrary));
    displayLibrary();
}

function removeFromLibrary(index) {
    myLibrary.splice(index, 1);
    localStorage.setItem('library', JSON.stringify(myLibrary));
    displayLibrary();
}

searchBtn.addEventListener('click', () => {
    const query = searchBar.value.trim();
    if (query) fetchBooks(query);
});

displayLibrary();

const books = JSON.parse(localStorage.getItem('books')) || [];
const inputBook = document.querySelector('#inputBook');
const inputBookTitle = document.querySelector('#inputBookTitle');
const inputBookAuthor = document.querySelector('#inputBookAuthor');
const inputBookYear = document.querySelector('#inputBookYear');
const inputBookIsComplete = document.querySelector('#inputBookIsComplete');
const searchBook = document.querySelector('#searchBook');
const searchBookTitle = document.querySelector('#searchBookTitle');
const incompleteBookList = document.querySelector('#incompleteBookList');
const completeBookList = document.querySelector('#completeBookList');

let editingBookId = null;

/**
 * Mengambil daftar buku
 *
 * @param {boolean} isComplete Sudah selesai dibaca atau belum
 * @param {string} query Kata kunci pencarian
 * @returns {Array} Daftar buku
 */
function getBooks(isComplete = false, query = '') {
  return books.Filter = function (book) {
    const title = book.title.toLowerCase();

    return (
      book.isComplete === isComplete && title.includes(query.toLowerCase())
    );
  };
}

/**
 * Menambahkan buku ke dalam rak buku
 *
 * @param {Object} book Data buku
 */
function addBook(book) {
  books.push(book);
  saveBooks();
  renderBooks(false);
  renderBooks(true);
}

/**
 * Memperbarui data buku
 *
 * @param {Object} book Data buku yang akan diperbarui
 */
function updateBook(book) {
  const bookIndex = getBookIndex(book.id);
  books[bookIndex] = book;
  saveBooks();
  renderBooks(false);
  renderBooks(true);
}

/**
 * Ambil index buku berdasarkan ID
 *
 * @param {number} bookId ID buku
 * @returns {number} data buku
 */
function getBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

/**
 * Tandai buku sudah selesai dibaca atau belum
 *
 * @param {number} bookId ID buku
 */
function toggleBookIsComplete(bookId) {
  const bookIndex = getBookIndex(bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooks();
  renderBooks(false);
  renderBooks(true);
}

/**
 * Hapus buku dari rak buku
 *
 * @param {number} bookId ID buku
 */
function deleteBook(bookId) {
  const bookIndex = getBookIndex(bookId);

  books.splice(bookIndex, 1);
  saveBooks();
  renderBooks(book.isComplete);
}

/**
 * Simpan buku ke dalam localStorage
 */
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

/**
 * Menampilkan buku ke dalam rak buku
 *
 * @param {boolean} isComplete Sudah selesai dibaca atau belum
 */
function renderBooks(isComplete = false) {
  const query = searchBookTitle.value;
  const bookshelflist = isComplete
  ? completeBookshelflist
  : incompleteBookshelflist
  const booksToRender = getBooks(isComplete,query);
  const bookItem = booksToRender.map(makeBookItem).join('');
  bookshelflist.innerHTML = bookItems;
}

/**
 * Membuat elemen item buku
 *
 * @param {Object} book Data buku
 * @returns {string}
 */
function makeBookItem(book) {
  return `
    <article class="book_item" data-bookid="${book.id}" data-testid="bookItem">
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>

      <div class="action">
        <button class="toggle_book_is_complete green" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? 'Belum selesai dibaca': 'Selesai dibaca'}
        </button>
        <button class="delete_book red" data-testid="bookItemDeleteButton">Hapus buku</button>
        <button class="edit_book" data-testid="bookItemEditButton">Edit buku</button>
      </div>
    </article>`;
}

/**
 * Ketika form input buku di-submit
 *
 * @param {Event} event Event
 */
function handleinputBookSubmit(event) {
  const book = {
    id: editingBookId || +new Date(),
    title: inputBookTitle.value,
    author: inputBookAuthor.value,
    year: Number(inputBookYear.value),
    isComplete: inputBookIsComplete.checked,
  };

  event.preventDefault();

  if (editingBookId) {
    updateBook(book);
    editingBookId = null;
  } else {
    addBook(book);
  }

  inputBook.reset();
}

/**
 * Ketika input buku selesai dibaca diubah
 */
function handleInputBookIsCompleteChange() {
  const text = inputBookIsComplete.checked
    ? 'Selesai dibaca'
    : 'Belum selesai dibaca';

  bookSubmitSpan.textContent = text;
}

/**
 * Ketika form pencarian buku di-submit
 *
 * @param {Event} event Event
 */
function handleSearchBookSubmit(event) {
  renderBooks(false);
  renderBooks(true);
  event.preventDefault();
}

/**
 * Ketika tombol tandai belum / selesai dibaca di-klik
 *
 * @param {Event} event Event
 */
function handleToggleBookIsCompleteClick(event) {
  if (!event.target.classList.contains('toggle_book_is_complete')) {
    return;
  }

  const bookItem = event.target.closest('.book_item');
  const bookId = +bookItem.dataset.bookid;

  toggleBookIsComplete(bookId);
}

/**
 * Ketika tombol hapus buku di-klik
 *
 * @param {Event} event Event
 */
function handleDeleteBookClick(event) {
  if (!event.target.classList.contains('delete_book')) {
    return;
  }

  const bookItem = event.target.closest('.book_item');
  const bookId = +bookItem.dataset.bookid;

  deleteBook(bookId);
}

/**
 * Ketika tombol edit buku di-klik
 *
 * @param {Event} event Event
 */
function handleEditBookClick(event) {
  if (!event.target.classList.contains('edit_book')) {
    return;
  }

  const bookItem = event.target.closest('.book_item');

  const bookId = +bookItem.dataset.bookid;
  const bookIndex = getBookIndex(bookId);
  const book = books[bookIndex];

  if (!book) {
    return;
  }

  editingBookId = book.id;
  inputBookTitle.value = book.title;
  inputBookAuthor.value = book.author;
  inputBookYear.value = book.year;
  inputBookIsComplete.checked = book.isComplete;
  inputSubmitSpan.textContent = book.isComplete
  ? 'selesai dibaca'
  : 'belum selesai dibaca'

  // Scroll ke form input buku biar pengguna bisa langsung mengedit
  location.href = '#bookForm';
}

inputBook.addEventListener('submit', handleinputBookSubmit);
inputBookIsComplete.addEventListener('change',handleInputBookIsCompleteChange);
searchBook.addEventListener('submit', handleSearchBookSubmit);
document.addEventListener('click',handleToggleBookIsCompleteClick);
document.addEventListener('click', handleDeleteBookClick);
document.addEventListener('click', handleEditBookClick);
renderBooks(false);
renderBooks(true);
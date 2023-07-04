const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
      loadDataFromStorage();
    }
});

function addBook() {
   const titleBook = document.getElementById("inputBookTitle").value;
   const authorBook = document.getElementById("inputBookAuthor").value;
   const yearBook = document.getElementById("inputBookYear").value;
   const checkBook = document.getElementById("inputBookIsComplete").checked;

   const generatedID = generateId();
   if(checkBook == true){
     const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, true);
     books.push(bookObject);
   } else {
     const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, false);
     books.push(bookObject);
   }
  
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function generateId() {
    return +new Date();
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
   const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
   uncompletedBOOKList.innerHTML = "";

   const completedBOOKList = document.getElementById("completeBookshelfList");
   completedBOOKList.innerHTML = "";
 
   for(bookItem of books){
     const bookElement = makeBook(bookItem);
   
      if(bookItem.isCompleted == false)
          uncompletedBOOKList.append(bookElement);
      else
          completedBOOKList.append(bookElement);
   }
});
 
 
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makeBook(bookObject) {
 
   const textTitle = document.createElement("h3");
   textTitle.innerText = bookObject.title;
 
   const textAuthor = document.createElement("p");
   textAuthor.innerText = "Penulis : " + bookObject.author;

   const textYear = document.createElement("p");
   textYear.innerText = "Tahun : " + bookObject.year;
 
   const container = document.createElement("article");
   container.classList.add("book_item")
   container.append(textTitle, textAuthor, textYear);
   container.setAttribute("id", `book-${bookObject.id}`);

   if(bookObject.isCompleted){
 
      const undoButton = document.createElement("button");
      undoButton.innerText = "Belum selesai dibaca";
      undoButton.classList.add("undo-button", "green");
      undoButton.addEventListener("click", function () {
          undoTaskFromCompleted(bookObject.id);
      });
 
      const trashButton = document.createElement("button");
      trashButton.innerText = "Hapus buku"
      trashButton.classList.add("trash-button", "red");
      trashButton.addEventListener("click", function () {
          removeTaskFromCompleted(bookObject.id);
      });

      const action = document.createElement("div");
      action.classList.add("action");
      action.append(undoButton, trashButton);
 
      container.append(action);
  } else {
      const checkButton = document.createElement("button");
      checkButton.innerText = "Selesai dibaca";
      checkButton.classList.add("check-button", "green");
      checkButton.addEventListener("click", function () {
          addTaskToCompleted(bookObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.innerText = "Hapus buku"
      trashButton.classList.add("trash-button", "red");
      trashButton.addEventListener("click", function () {
          removeTaskFromCompleted(bookObject.id);
      });

      const action = document.createElement("div");
      action.classList.add("action");
      action.append(checkButton, trashButton);
 
      container.append(action);
  }
 
 
  return container;
 
}

function addTaskToCompleted(bookId) {
 
   const bookTarget = findBook(bookId);
   if(bookTarget == null) return;
 
   bookTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function findBook(bookId){
  for(bookItem of books){
      if(bookItem.id === bookId){
          return bookItem
      }
  }
  return null
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if(bookTarget === -1) return;
  books.splice(bookTarget, 1);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(bookId){
 
 
  const bookTarget = findBook(bookId);
  if(bookTarget == null) return;
 
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
   for(index in books){
       if(books[index].id === bookId){
           return index
       }
   }
   return -1
}

function saveData() {
  if(isStorageExist()){
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if(typeof(Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
 
  let data = JSON.parse(serializedData);
 
  if(data !== null){
      for(book of data){
          books.push(book);
      }
  }
 
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Untuk pencarian buku harus ditulis secara mendetail, contoh : Komik One Piece chapter 207 / Kamus bahasa Indonesia
document.getElementById('searchSubmit').addEventListener("click", function (event){
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (buku of bookList) {
      if (searchBook !== buku.innerText.toLowerCase()) {
        buku.parentElement.style.display = "none";
      } else {
        buku.parentElement.style.display = "block";
      }
    }
})

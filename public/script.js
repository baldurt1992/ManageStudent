import students from "../model/ModelStudents.js";

import {
  handleSidebarClick,
  createTableData,
  createTableManageStudent,
  createTableCreateStudent,
} from "../controller/ControllerStudents.js";

import icons from "../model/ModelIcons.js";

const sidebar = document.getElementById("sidebar");
const liElements = sidebar.querySelectorAll("li");
const btnBack = document.querySelector("#back");
const btnNext = document.querySelector("#next");
const paginationBtn = document.getElementById("pagination-btn");
const defaultText = document.getElementById("default-text");
const createStudenForm = document.getElementById("create-student-form");
const addStudentButton = document.getElementById("add-student-button");

const itemsPerPage = 10;
let currentPage = 1;

const spanPagination = document.querySelector("#pagination-btn span");
let totalPage = Math.ceil(students.length / itemsPerPage);

liElements.forEach((li) => {
  li.addEventListener("click", () => {
    createStudenForm.classList.remove("form-effect");

    paginationBtn.style.display = "flex";
    defaultText.style.display = "none";

    const clickedLi = event.target.closest("li");

    if (!clickedLi) return;

    liElements.forEach((item) => {
      item.classList.remove("selected");
    });

    li.classList.add("selected");

    if (clickedLi.id === "manage-notes") {
      handleSidebarClick(clickedLi.id, "LI");
      renderPageManageNotes(currentPage);
      createStudenForm.style.display = "none";
      totalPage = Math.ceil(students.length / itemsPerPage);
      updatePaginationInfo(currentPage, totalPage);
      resetPagination();
    } else if (clickedLi.id === "manage-students") {
      handleSidebarClick(clickedLi.id, "LI");
      renderPageManagStudent(currentPage);
      createStudenForm.style.display = "none";
      totalPage = Math.ceil(students.length / itemsPerPage);
      updatePaginationInfo(currentPage, totalPage);
      resetPagination();
    } else if (clickedLi.id === "create-student") {
      handleSidebarClick(clickedLi.id, "LI");
      paginationBtn.style.display = "none";
      const container = document.getElementById("table-data");
      container.innerHTML = "";
      createStudenForm.style.display = "flex";
    }
  });
});

addStudentButton.addEventListener("click", () => {
  const studentDocInput = document.getElementById("student-doc");
  const studentNameInput = document.getElementById("student-name");
  const studentNoteInput1 = document.getElementById("note1");
  const studentNoteInput2 = document.getElementById("note2");
  const studentNoteInput3 = document.getElementById("note3");
  const createStudentSuccessful = document.getElementById(
    "create-student-successful"
  );
  const docInput = document.getElementById("doc-input");
  const nameInput = document.getElementById("name-input");
  const notesInput = document.getElementById("notes-input");

  function addBounceAnimation(inputField) {
    inputField.classList.add("form-effect");
    setTimeout(function () {
      inputField.classList.remove("form-effect");
    }, 2000);
  }

  const studentDoc = studentDocInput.value;
  const studentName = studentNameInput.value;

  const studentNotesId = [
    studentNoteInput1,
    studentNoteInput2,
    studentNoteInput3,
  ];

  const docPattern = /^\d+$/;
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const notesPattern = /^\d+(\.\d+)?$/;
  let isValid = true;

  docInput.classList.remove("red-border");
  nameInput.classList.remove("red-border");
  notesInput.classList.remove("red-border");

  if (!docPattern.test(studentDoc)) {
    studentDocInput.value = "";
    studentDocInput.placeholder = "Por favor ingrese solo números";
    docInput.classList.add("red-border");
    isValid = false;
    addBounceAnimation(studentDocInput);
  }

  if (!namePattern.test(studentName)) {
    studentNameInput.value = "";
    studentNameInput.placeholder = "Por favor ingrese Solo letras";
    nameInput.classList.add("red-border");
    isValid = false;
    addBounceAnimation(studentNameInput);
  }

  studentNotesId.forEach((note) => {
    if (!notesPattern.test(note.value)) {
      note.value = "";
      note.placeholder = "Por favor ingrese un valor válido";
      note.style.border = "1px solid red";
      isValid = false;
      addBounceAnimation(note);
    } else {
      note.classList.remove("red-border");

      const noteValue = parseFloat(note.value);
      if (noteValue < 1 || noteValue > 5) {
        note.value = "";
        note.placeholder = "Solo valores entre 0 y 5";
        note.style.fontSize = "1vw";
        note.style.border = "1px solid red";
        isValid = false;
        addBounceAnimation(note);
      } else {
        note.style.borderColor = "";
      }
    }
  });

  if (!isValid) return;

  createTableCreateStudent("student-doc", "student-name", studentNotesId);

  resetPagination();

  createStudentSuccessful.style.display = "block";
  createStudentSuccessful.textContent = "Estudiante creado con éxito";
  createStudentSuccessful.style.color = "#2c2c54";
  createStudentSuccessful.style.fontSize = "1vw";

  setTimeout(() => {
    createStudentSuccessful.classList.add("fade-out");
    setTimeout(() => {
      createStudentSuccessful.style.display = "none";
      createStudentSuccessful.classList.remove("fade-out");
    }, 1000);
  }, 1000);

  studentDocInput.value = "";
  studentDocInput.placeholder = "";
  studentNameInput.value = "";
  studentNameInput.placeholder = "";
  studentNotesId.forEach((note) => {
    note.value = "";
    note.placeholder = "";
  });
  docInput.classList.remove("red-border");
  nameInput.classList.remove("red-border");
  studentNotesId.forEach((note) => {
    note.style.borderColor = "";
  });
});

const deleteIcons = document.getElementsByClassName("delete-icon");
Array.from(deleteIcons).forEach((deleteIcon) => {
  deleteIcon.addEventListener("click", () => {
    if (row) {
      row.remove(), resetPagination();
    }
  });
});

paginationBtn.style.display = "none";
createStudenForm.style.display = "none";

function updatePaginationInfo(currentPage, totalPage) {
  spanPagination.textContent = `${currentPage} de ${totalPage}`;
}

function resetPagination() {
  if (students.length > 0) {
    currentPage = 1;
    totalPage = Math.ceil(students.length / itemsPerPage);
    updatePaginationInfo(currentPage, totalPage);
    if (
      document.getElementById("manage-notes").classList.contains("selected")
    ) {
      renderPageManageNotes(1);
    }
    if (
      document.getElementById("manage-students").classList.contains("selected")
    ) {
      renderPageManagStudent(1);
    }
  }
}

function renderPageManageNotes(pageNumber) {
  const container = document.getElementById("table-data");
  container.innerHTML = "";

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const studentsToShow = students.slice(startIndex, endIndex);

  createTableData(studentsToShow, "table-data");
}

function renderPageManagStudent(pageNumber) {
  const container = document.getElementById("table-data");
  container.innerHTML = "";

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const studentsToShow = students.slice(startIndex, endIndex);

  createTableManageStudent(studentsToShow, "table-data", icons);
}

function handlePageChange(action) {
  if (action === "prev" && currentPage > 1) {
    currentPage--;
  } else if (action === "next" && currentPage < totalPage) {
    currentPage++;
  }

  if (document.getElementById("manage-notes").classList.contains("selected")) {
    renderPageManageNotes(currentPage);
  } else if (
    document.getElementById("manage-students").classList.contains("selected")
  ) {
    renderPageManagStudent(currentPage);
  }
  totalPage = Math.ceil(students.length / itemsPerPage);
  updatePaginationInfo(currentPage, totalPage);
}

btnBack.addEventListener("click", () => handlePageChange("prev"));
btnNext.addEventListener("click", () => handlePageChange("next"));

export { resetPagination, renderPageManagStudent, renderPageManageNotes };

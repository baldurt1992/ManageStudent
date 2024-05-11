import icons from "../model/ModelIcons.js";
import students from "../model/ModelStudents.js";
import {
  resetPagination,
  renderPageManagStudent,
  renderPageManageNotes,
} from "../public/script.js";

let currentPage = 1;
let editingStudentIndex = null;

function handleSidebarClick(id, element) {
  if (id === event.target.id && event.target.tagName === element) {
    switch (id) {
      case "manage-notes":
        document.getElementById("main-title").textContent = "Gestionar Notas";

        break;
      case "manage-students":
        document.getElementById("main-title").textContent =
          "Gestionar estudiantes";
        break;
      case "create-student":
        document.getElementById("main-title").textContent = "Crear estudiante";
    }
  }
}

function createTableData(data, containerId) {
  const container = document.getElementById(containerId);

  const table = document.createElement("table");
  table.classList.add("students-table");

  const headerRow = document.createElement("tr");
  const headers = ["Cédula", "Nombre", "Notas", "Nota final", "Resultado"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  data.forEach((student) => {
    const row = document.createElement("tr");
    const rowData = [
      student.document,
      student.name,
      student.notes.join(" | "),
      calculateFinalNotes(student.notes),
      determineResult(calculateFinalNotes(student.notes)),
    ];

    rowData.forEach((cellData) => {
      const cell = document.createElement("td");

      cell.textContent = cellData;

      row.appendChild(cell);
    });
    table.appendChild(row);
  });
  container.appendChild(table);
}

function deleteStudent(studentIndex) {
  if (studentIndex > -1) {
    students.splice(studentIndex, 1);

    resetPagination();

    if (
      document.getElementById("manage-notes").classList.contains("selected")
    ) {
      renderPageManageNotes(currentPage);
    } else if (
      document.getElementById("manage-students").classList.contains("selected")
    ) {
      renderPageManagStudent(currentPage);
    }
  }
}

function editStudent(studentIndex) {
  if (studentIndex > -1) {
    if (editingStudentIndex !== -1) {
      cancelEdit();
    }
    const row = document.querySelector(`#student-${studentIndex}`);
    const documentCell = row.querySelector(".document-cell");
    const nameCell = row.querySelector(".name-cell");
    const editIcon = row.querySelector(`.edit-icon-${studentIndex}`);
    const deleteIcon = row.querySelector(`.delete-icon-${studentIndex}`);

    editIcon.style.display = "none";
    deleteIcon.style.display = "none";

    const documentInput = document.createElement("input");
    documentInput.type = "text";
    documentInput.value = students[studentIndex].document;
    documentInput.classList.add("input-edit-student-document");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = students[studentIndex].name;
    nameInput.classList.add("input-edit-student-name");

    documentCell.innerHTML = "";
    documentCell.appendChild(documentInput);

    nameCell.innerHTML = "";
    nameCell.appendChild(nameInput);

    const saveIcon = document.createElement("img");
    saveIcon.src = icons.done;
    saveIcon.alt = "Guardar";
    saveIcon.classList.add("save-icon");

    const actionCell = row.querySelector(".action-cell");
    actionCell.innerHTML = "";
    actionCell.appendChild(saveIcon);

    saveIcon.addEventListener("click", () => {
      const newDocument = documentInput.value;
      const newName = nameInput.value;

      const docPattern = /^\d+$/;
      const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      let isValid = true;

      documentInput.classList.remove("red-border");
      nameInput.classList.remove("red-border");

      if (!docPattern.test(newDocument)) {
        documentInput.value = "";
        documentInput.placeholder = "Por favor ingresa solo números";
        documentInput.classList.add("red-border");
        isValid = false;
      }

      if (!namePattern.test(newName)) {
        nameInput.value = "";
        nameInput.placeholder = "Por favor Ingresa solo letras";
        nameInput.classList.add("red-border");
        isValid = false;
      }

      if (!isValid) return;

      students[studentIndex].document = newDocument;
      students[studentIndex].name = newName;

      renderPageManagStudent(currentPage);
      resetPagination();

      editIcon.style.display = "inline-block";
      deleteIcon.style.display = "inline-block";

      editingStudentIndex = -1;

      editIcon.style.display = "inline-block";
      deleteIcon.style.display = "inline-block";
      documentCell.innerHTML = students[studentIndex].document;
      nameCell.innerHTML = students[studentIndex].name;
      saveIcon.style.display = "none";
      editingStudentIndex = -1;
    });

    editingStudentIndex = studentIndex;
  }
}

function cancelEdit() {
  if (editingStudentIndex !== null) {
    const row = document.querySelector(`#student-${editingStudentIndex}`);
    const documentCell = row.querySelector(".document-cell");
    const nameCell = row.querySelector(".name-cell");
    const saveIcon = row.querySelector(".save-icon");

    const editIcon = row.querySelector(`.edit-icon-${editingStudentIndex}`);
    const deleteIcon = row.querySelector(`.delete-icon-${editingStudentIndex}`);

    if (editIcon && deleteIcon) {
      editIcon.style.display = "inline-block";
      deleteIcon.style.display = "inline-block";
    }

    documentCell.innerHTML = students[editingStudentIndex].document;
    nameCell.innerHTML = students[editingStudentIndex].name;

    if (saveIcon) {
      saveIcon.remove();
    }

    editingStudentIndex = null;
  }
}

function createTableManageStudent(data, containerId, icons) {
  const container = document.getElementById(containerId);

  const table = document.createElement("table");
  table.classList.add("students-table");

  const headerRow = document.createElement("tr");
  const headers = ["Cédula", "Nombre", "Acción"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  data.forEach((student, studentIndex) => {
    const row = document.createElement("tr");
    row.id = `student-${studentIndex}`;
    const rowData = [student.document, student.name];

    rowData.forEach((cellData, index) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;

      if (index === 0) {
        cell.classList.add("document-cell");
      } else if (index === 1) {
        cell.classList.add("name-cell");
      }

      row.appendChild(cell);

      if (index === rowData.length - 1) {
        const actionCell = document.createElement("td");
        actionCell.classList.add("action-cell");

        const editIcon = document.createElement("img");
        editIcon.src = icons.edit;
        editIcon.alt = "Editar";
        editIcon.classList.add("edit-icon");
        editIcon.classList.add("edit-icon");
        editIcon.classList.add(`edit-icon-${studentIndex}`);

        editIcon.addEventListener("click", () => {
          editStudent(studentIndex);
        });

        actionCell.appendChild(editIcon);

        const deleteIcon = document.createElement("img");
        deleteIcon.src = icons.delete;
        deleteIcon.alt = "Eliminar";
        deleteIcon.classList.add("delete-icon");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.classList.add(`delete-icon-${studentIndex}`);

        deleteIcon.addEventListener("click", () => {
          const confirmation = confirm(
            "¿Está seguro que desea eliminar el estudiante?"
          );

          if (confirmation) {
            deleteStudent(studentIndex);
          }
        });

        actionCell.appendChild(deleteIcon);
        row.appendChild(actionCell);
      }
    });
    table.appendChild(row);
  });
  container.appendChild(table);
}

function createTableCreateStudent(studentDoc, studentName, arrayNotes) {
  const documentInput = document.getElementById(studentDoc).value;
  const nameInput = document.getElementById(studentName).value;

  const notes = [];

  arrayNotes.forEach((input) => {
    notes.push(parseFloat(input.value));
  });

  const newStudent = {
    name: nameInput,
    document: documentInput,
    notes: notes,
  };

  students.unshift(newStudent);
}

function calculateFinalNotes(notes) {
  const weight1 = 0.2;
  const weight2 = 0.4;
  const weight3 = 0.4;

  const finalNote =
    notes[0] * weight1 + notes[1] * weight2 + notes[2] * weight3;
  return finalNote.toFixed(1);
}

function determineResult(finalNote) {
  return finalNote > 3.5 ? "Ganó" : "Perdió";
}

export {
  handleSidebarClick,
  createTableData,
  createTableManageStudent,
  createTableCreateStudent,
};

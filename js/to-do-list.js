/* global document:true localStorage:true */
document.addEventListener(`DOMContentLoaded`, () => {

	let newTaskButton = document.getElementById(`addTask`),
		sortButton = document.getElementById(`sort`),
		closeButtonModalOk = document.getElementById(`modalHideButtonOk`),
		closeButtonModalCancel = document.getElementById(`modalHideButtonCancel`),
		id = 0,
		taskArray = [ ];

	function loadingTasks() {
		let taskArrLength = taskArray.length;
		for (let i = 0; i < taskArrLength; i += 1) {
			generateTasksOnSite(taskArray[i]);
		}
	}

	function refreshTasks() {
		let taskHolderDiv = document.getElementById(`taskHolder`);
		while (taskHolderDiv.hasChildNodes()) {
			taskHolderDiv.removeChild(taskHolderDiv.lastChild);
		}
		loadingTasks();
	}

	function sort(what) {
		let arrLength = taskArray.length,
			taskHolderDiv = document.getElementById(`taskHolder`);
		switch (what) {
			case `ready`:
				refreshTasks();
				while (taskHolderDiv.hasChildNodes()) {
					taskHolderDiv.removeChild(taskHolderDiv.lastChild);
				}
				for (let i = 0; i < arrLength; i += 1) {
					if (taskArray[i].status) {
						generateTasksOnSite(taskArray[i]);
					}
				}
				break;
			case `notReady`:
				refreshTasks();
				while (taskHolderDiv.hasChildNodes()) {
					taskHolderDiv.removeChild(taskHolderDiv.lastChild);
				}
				for (let i = 0; i < arrLength; i += 1) {
					if (!taskArray[i].status) {
						generateTasksOnSite(taskArray[i]);
					}
				}
				break;
			case `oldest`:
				taskArray.sort(function (a, b) {
					return a.createdMS - b.createdMS;
				});
				refreshTasks();
				break;
			case `newest`:
				taskArray.sort(function (a, b) {
					return b.createdMS - a.createdMS;
				});
				refreshTasks();
				break;
			default:
		}
	}

	function clearSortButtons(){
	let sortingButtons = document.getElementById(`sort`);
		for(let i = 1;i < sortingButtons.childNodes.length;i += 1){
			if(sortingButtons.childNodes[i].className){
				sortingButtons.childNodes[i].className = `btn btn-warning btn-group col-xs-6 col-sm-3`;
			}
		}
	}

	function whatSortButtonWasClicked(event) {
		if (event.target !== event.currentTarget) {
			clearSortButtons();
			sort(event.target.id);
			event.target.className = `btn btn-warning btn-group col-xs-6 col-sm-3 active`;
		}
		event.stopPropagation();
	}

	function saveActualData() {
		localStorage.setItem(`localStorageTaskArray`, JSON.stringify({
			id: id,
			taskArray: taskArray
		}));
	}

	function clearFirstChild(div) {
		if (div.firstChild) {
			div.removeChild(div.firstChild);
		}
	}

	function hideModalWindow() {
		let modalDiv = document.getElementById(`modalDiv`);
		modalDiv.data = ``;

		modalDiv.style.display = `none`;
		modalDiv.className = `modal fade bs-example-modal-sm`;
	}

	function showModalWindow(text, action, task) {
		let modalDiv = document.getElementById(`modalDiv`),
			modalDivText = document.getElementById(`modalDivText`);

		modalDiv.data = task.id;

		modalDiv.style.display = `block`;
		modalDiv.className = `modal bs-example-modal-sm`;
		modalDivText.innerHTML = text;

		if (action === `alert`) {
			document.getElementById(`modalHideButtonCancel`).style.display = `none`;
		} else {
			document.getElementById(`modalHideButtonCancel`).style.display = `inline-block`;
		}
		
	}

	function deleteTask(taskID) {

		let taskDiv = document.getElementById(taskID),
			task = taskArray.find(function () { return id === taskID; });
		
		taskDiv.parentNode.removeChild(taskDiv);
		taskArray.splice(taskArray.indexOf(task), 1);
		saveActualData();
		deleteView();

	}

	function getMSTime() {
		let actualDate = new Date(),
			readActualDate = actualDate.getTime();
		return readActualDate;
	}

	function loadData() {
		if (localStorage.getItem(`localStorageTaskArray`)) {
			let loadedData = JSON.parse(localStorage.getItem(`localStorageTaskArray`));
			id = loadedData.id;
			taskArray = loadedData.taskArray;

			loadingTasks();
		}
	}


	function createView(task, forWho) {

		let taskIsDone,
			doc;

		if (forWho === `search`) {
			if (task.status) {
				taskIsDone = `<span class="glyphicon glyphicon-ok text-success"></span>`;
			} else {
				taskIsDone = `<span class="glyphicon glyphicon-remove text-danger"></span>`;
			}
			
			doc = `
					<div class="panel panel-success">
						<div class="panel-heading">
							${task.name}
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="panel panel-info">
									<div class="panel-heading">Nazwa zadania</div>
									<div class="panel-body">
										${task.name}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Opis zadania</div>
									<div class="panel-body">
										${task.description}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Do kiedy?</div>
									<div class="panel-body">
										${task.deadline}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Data dodatnia</div>
									<div class="panel-body">
										${task.createdLocal}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Data ostatniego edytowania</div>
									<div class="panel-body">
										${task.lastEdit}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Zakończone?</div>
									<div class="panel-body">
										${taskIsDone}
									</div>
								</div>
							</div>
						</div>
					</div>`;
		} else if (forWho === `edit`) {
			if (task.status) {
				taskIsDone = `<input type="checkbox" checked id="taskStatus">`;
			} else {
				taskIsDone = `<input type="checkbox" id="taskStatus">`;
			}
			
			doc = `
					<div class="panel panel-primary">
						<div class="panel-heading">
							${task.name}
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="panel panel-info">
									<div class="panel-heading">Nazwa zadania</div>
									<div class="panel-body">
										<input type="text" class="form-control" value="${task.name}" id="taskName">
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Opis zadania</div>
									<div class="panel-body">
										<textarea class="form-control" rows="3" id="taskDescription">${task.description}</textarea>
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Do kiedy?</div>
									<div class="panel-body">
										<input type="text" class="form-control" value="${task.deadline}" id="taskDeadline">
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Data dodatnia</div>
									<div class="panel-body">
										${task.createdLocal}
									</div>
								</div>
								<div class="panel panel-info">
									<div class="panel-heading">Data ostatniego edytowania</div>
									<div class="panel-body">
										${task.lastEdit}
									</div>
								</div>
									<div class="checkbox text-center">
								        <label>
								          	${taskIsDone}
								          	Wykonane ?
								        </label>
								    </div>
								</div>
							</div>
						</div>
					</div>`;
		}
		return doc;

	}

	function deleteView(){
		let infoHolderDiv = document.getElementById(`infoHolder`);
		infoHolderDiv.innerHTML = ``;
	}

	function editTask(task) {

		let infoHolderDiv = document.getElementById(`infoHolder`),
			panelPrimaryDiv = document.createElement(`div`),
			saveButton = document.createElement(`button`);
			
		clearFirstChild(infoHolderDiv);

		saveButton.onclick = function () {
			saveChanges(task);
		};
		
		saveButton.className = `btn btn-success btn-sm center-block`;
		saveButton.innerHTML = `Zapisz`;

		panelPrimaryDiv.innerHTML = createView(task, `edit`);

		infoHolderDiv.appendChild(panelPrimaryDiv);

		panelPrimaryDiv.childNodes[1].childNodes[3].appendChild(saveButton);

	}

	function saveChanges(task) {
		let taskNameInput = document.getElementById(`taskName`),
			taskDescriptionInput = document.getElementById(`taskDescription`),
			taskDeadlineInput = document.getElementById(`taskDeadline`),
			taskHolderDiv = document.getElementById(`taskHolder`),
			taskStatus = document.getElementById(`taskStatus`),
			indexOfTask = taskArray.indexOf(task);

		taskArray[indexOfTask].description = taskDescriptionInput.value;
		taskArray[indexOfTask].deadline = taskDeadlineInput.value;
		taskArray[indexOfTask].lastEdit = new Date().toLocaleString();
		taskArray[indexOfTask].name = taskNameInput.value;
		taskArray[indexOfTask].status = taskStatus.checked;

		saveActualData();

		while (taskHolderDiv.hasChildNodes()) {
			taskHolderDiv.removeChild(taskHolderDiv.lastChild);
		}

		loadData();
		editTask(taskArray[indexOfTask]);
		showModalWindow(`Zmiany zostały zapisane!`, `alert`, ``);
	}

	function searchTask(task) {
		let infoHolderDiv = document.getElementById(`infoHolder`),
			panelSuccessDiv = document.createElement(`div`);

		clearFirstChild(infoHolderDiv);

		panelSuccessDiv.innerHTML = createView(task, `search`);

		infoHolderDiv.appendChild(panelSuccessDiv);

	}

	function generateTasksOnSite(task) {

		let taskHolderDiv = document.getElementById(`taskHolder`);

		let panelInfoDiv = document.createElement(`div`),
			panelBodyDiv = document.createElement(`div`),
			panelHeadingDiv = document.createElement(`div`),
			editButton = document.createElement(`div`),
			searchButton = document.createElement(`div`),
			deleteButton = document.createElement(`div`);

		let chevronRightGlyphicon = document.createElement(`span`),
			searchGlyphicon = document.createElement(`span`),
			trashGlyphicon = document.createElement(`span`),
			glyphicon = document.createElement(`span`);

		chevronRightGlyphicon.className = `glyphicon glyphicon-chevron-right`;
		searchGlyphicon.className = `glyphicon glyphicon-search`;
		trashGlyphicon.className = `glyphicon glyphicon-trash`;

		editButton.innerHTML = `Edytuj`;
		searchButton.innerHTML = `Podgląd`;
		deleteButton.innerHTML = `Usuń`;


		panelInfoDiv.id = task.id;

		deleteButton.onclick = function () {
			showModalWindow(`Napewno chcesz usunąć to zadanie?`, `confirm`, task, true);
		};

		searchButton.onclick = function () {
			searchTask(task);
		};

		editButton.onclick = function () {
			editTask(task);
		};

		if (task.status) {
			glyphicon.className = `glyphicon glyphicon-ok text-success pull-left`;
		} else {
			glyphicon.className = `glyphicon glyphicon-remove text-danger pull-left`;
		}



		panelHeadingDiv.innerHTML = `${task.name}`;
		
		panelInfoDiv.className = `panel panel-info`;
		panelHeadingDiv.className = `panel-heading`;
		panelBodyDiv.className = `panel-body`;
		editButton.className = `btn btn-primary pull-right btn-sm col-xs-4 col-sm-2`;
		searchButton.className = `btn btn-info pull-right btn-sm col-xs-4 col-sm-2`;
		deleteButton.className = `btn btn-danger pull-right btn-sm col-xs-4 col-sm-2`;

		taskHolderDiv.appendChild(panelInfoDiv);
		panelInfoDiv.appendChild(panelHeadingDiv);
		panelInfoDiv.appendChild(panelBodyDiv);
		panelBodyDiv.appendChild(editButton);
		panelBodyDiv.appendChild(searchButton);
		panelBodyDiv.appendChild(deleteButton);
		panelHeadingDiv.appendChild(glyphicon);

		editButton.appendChild(chevronRightGlyphicon);
		searchButton.appendChild(searchGlyphicon);
		deleteButton.appendChild(trashGlyphicon);
		
	}

	loadData();

	function getTaskName() {
		let newTaskName = document.querySelector(`#newTaskName`).value;
		return newTaskName;
	}

	function getTaskID() {
		id += 1;
		return id;
	}

	function saveTask(task) {
		taskArray.unshift(task);
		saveActualData();
	}

	class Task {
		constructor(_taskId, _taskName, _createdMS, _status) {
			this.id = _taskId;
			this.name = _taskName;
			this.description = _taskName;
			this.createdMS = _createdMS;
			this.createdLocal = (new Date(this.createdMS)).toLocaleString();
			this.status = _status;
			this.lastEdit = (new Date(this.createdMS)).toLocaleString();
			this.lastEditMS = _createdMS;
			this.deadline = (new Date(this.createdMS+216000000)).toLocaleString();
		}

		getLocalTime() {

		}
	}

	function clearInput(inputId) {
		document.getElementById(inputId).value = ``;
	}

	function addNewTask() {
		if (document.getElementById(`newTaskName`).value) {
			let newTask = new Task(getTaskID(), getTaskName(), getMSTime(), false);
			saveTask(newTask);
			refreshTasks();
			sort(`newest`);
			clearInput(`newTaskName`);
		}
	}

	newTaskButton.addEventListener(`click`, addNewTask);
	sortButton.addEventListener(`click`, whatSortButtonWasClicked, false);
	closeButtonModalOk.addEventListener(`click`, function () {
		let taskID = document.getElementById(`modalDiv`).data;
		if (taskID) {
			deleteTask(taskID);
			hideModalWindow();
		} else {
			hideModalWindow();
		}
	}, false);
	closeButtonModalCancel.addEventListener(`click`, hideModalWindow);


});
/* global document:true localStorage:true confirm:true*/
document.addEventListener('DOMContentLoaded', () => {

	let newTaskButton = document.querySelector('#addTask'),
		sortButton = document.querySelector('#sort'),
		id = 0,
		taskArray = [ ];

 
	function whatSortButtonWasClicked(event) {
		if (event.target !== event.currentTarget) {
			let clickedItem = event.target.id;
			sort(clickedItem);
		}
		event.stopPropagation();
	}


	function sort(what){
		let arrLength = taskArray.length,
			taskHolderDiv = document.querySelector('#taskHolder');
		switch (what) {
       		case 'all':
       			refreshTasks();
       		break;
       		case 'ready':
       			refreshTasks();
       			while (taskHolderDiv.hasChildNodes()) {
					taskHolderDiv.removeChild(taskHolderDiv.lastChild);
				}
       			for (let i = 0; i < arrLength; i += 1){
       				if(taskArray[i].status){
       					generateTasksOnSite(taskArray[i]);
       				}
       			}
       		break;
       		case 'notReady':
       			refreshTasks();
       			while (taskHolderDiv.hasChildNodes()) {
					taskHolderDiv.removeChild(taskHolderDiv.lastChild);
				}
       			for (let i = 0; i < arrLength; i += 1){
       				if(!taskArray[i].status){
       					generateTasksOnSite(taskArray[i]);
       				}
       			}
       		break;
       		case 'oldest':
       			taskArray.sort(function(a, b) {
				    return parseFloat(a.created) - parseFloat(b.created);
				});
       			refreshTasks();
       		break;
       		case 'newest':
       			taskArray.sort(function(a, b) {
				    return parseFloat(b.created) - parseFloat(a.created);
				});
       			refreshTasks();
       		break;
       		default:
       }
	}

	function saveActualData() {
		localStorage.setItem('localStorageTaskArray', JSON.stringify({
			id: id,
			taskArray: taskArray
		}));
	}

	function clearDiv(div) {
		if (div.firstChild) {
			div.removeChild(div.firstChild);
		}
	}

	function deleteTask(task) {
		if (confirm('Napewno chcesz usunąć zadanie??') === true) {
			let taskDiv = document.querySelector(`[id='${task.id}']`);
			taskDiv.parentNode.removeChild(taskDiv);
			taskArray.splice(taskArray.indexOf(task), 1);
			saveActualData();
		}
	}

	function refreshTasks(){
		let taskHolderDiv = document.querySelector('#taskHolder');
		while (taskHolderDiv.hasChildNodes()) {
			taskHolderDiv.removeChild(taskHolderDiv.lastChild);
		}
		loadingTasks();

	}

	function saveChanges(task) {
		let taskNameInput = document.querySelector('#taskName'),
			taskDescriptionInput = document.querySelector('#taskDescription'),
			taskDeadlineInput = document.querySelector('#taskDeadline'),
			taskHolderDiv = document.querySelector('#taskHolder'),
			taskStatus = document.querySelector('#taskStatus'),
			indexOfTask = taskArray.indexOf(task);

		taskArray[indexOfTask].description = taskDescriptionInput.value;
		taskArray[indexOfTask].deadline = taskDeadlineInput.value;
		taskArray[indexOfTask].lastEdit = getActualTime();
		taskArray[indexOfTask].name = taskNameInput.value;
		taskArray[indexOfTask].status = taskStatus.checked;

		saveActualData();

		while (taskHolderDiv.hasChildNodes()) {
			taskHolderDiv.removeChild(taskHolderDiv.lastChild);
		}

		loadData();
		editTask(taskArray[indexOfTask]);
	}

	function searchTask(task) {
		let infoHolderDiv = document.querySelector('#infoHolder'),
			panelSuccessDiv = document.createElement('div'),
			taskIsDone;

		clearDiv(infoHolderDiv);
		
		if (task.status) {
			taskIsDone = `<span class='glyphicon glyphicon-ok text-success'></span>`;
		} else {
			taskIsDone = `<span class='glyphicon glyphicon-remove text-danger'></span>`;
		}

		panelSuccessDiv.innerHTML = `
					<div class='panel panel-success'>
						<div class='panel-heading'>
							${task.name}
							<span class='text-primary pull-right'>${task.created}</span>
						</div>
						<div class='panel-body'>
							<div class='row'>
								<div class='panel panel-info'>
									<div class='panel-heading'>Nazwa zadania</div>
									<div class='panel-body'>
										${task.name}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Opis zadania</div>
									<div class='panel-body'>
										${task.description}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Do kiedy?</div>
									<div class='panel-body'>
										${task.deadline}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Data dodatnia</div>
									<div class='panel-body'>
										${task.created}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Data ostatniego edytowania</div>
									<div class='panel-body'>
										${task.lastEdit}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Zakończone?</div>
									<div class='panel-body'>
										${taskIsDone}
									</div>
								</div>
							</div>
						</div>
					</div>`;

		infoHolderDiv.appendChild(panelSuccessDiv);

	}

	function editTask(task) {

		let infoHolderDiv = document.querySelector('#infoHolder'),
			panelPrimaryDiv = document.createElement('div'),
			saveButton = document.createElement('button'),
			taskIsDone;

		clearDiv(infoHolderDiv);

		saveButton.onclick = function () {
			saveChanges(task);
		};
		
		saveButton.className = 'btn btn-success btn-sm center-block';
		saveButton.innerHTML = `Zapisz`;

		if (task.status) {
			taskIsDone = `<input type="checkbox" checked id='taskStatus'>`;
		} else {
			taskIsDone = `<input type="checkbox" id='taskStatus'>`;
		}
		panelPrimaryDiv.innerHTML = `
					<div class='panel panel-primary'>
						<div class='panel-heading'>
							${task.name}
							<span class='pull-right'>${task.created}</span>
						</div>
						<div class='panel-body'>
							<div class='row'>
								<div class='panel panel-info'>
									<div class='panel-heading'>Nazwa zadania</div>
									<div class='panel-body'>
										<input type="text" class="form-control" value="${task.name}" id='taskName'>
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Opis zadania</div>
									<div class='panel-body'>
										<input type="text" class="form-control" value="${task.description}" id='taskDescription'>
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Do kiedy?</div>
									<div class='panel-body'>
										<input type="text" class="form-control" value="${task.deadline}" id='taskDeadline'>
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Data dodatnia</div>
									<div class='panel-body'>
										${task.created}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Data ostatniego edytowania</div>
									<div class='panel-body'>
										${task.lastEdit}
									</div>
								</div>
								<div class='panel panel-info'>
									<div class='panel-heading'>Zakończone?</div>
									<div class='panel-body'>
										 <div class="checkbox">
								        <label>
								          ${taskIsDone}
								        </label>
								      </div>
									</div>
								</div>
							</div>
						</div>
					</div>`;

		infoHolderDiv.appendChild(panelPrimaryDiv);

		panelPrimaryDiv.childNodes[1].childNodes[3].appendChild(saveButton);

	}

	function generateTasksOnSite(task) {
		//generatorOfDom('taskHolder','div',`<span class='glyphicon glyphicon-remove text-danger'></span> ${task.name}`,'panel panel-info',null,task.id);


		let taskHolderDiv = document.querySelector('#taskHolder');

		let panelInfoDiv = document.createElement('div'),
			panelBodyDiv = document.createElement('div'),
			editButton = document.createElement('button'),
			searchButton = document.createElement('button'),
			deleteButton = document.createElement('button');



		panelInfoDiv.id = task.id;

		deleteButton.onclick = function () {
			deleteTask(task);
		};

		searchButton.onclick = function () {
			searchTask(task);
		};

		editButton.onclick = function () {
			editTask(task);
		};

		if (task.status) {
			panelBodyDiv.innerHTML = `<span class='glyphicon glyphicon-ok text-success'></span> ${task.name}`;
		} else {
			panelBodyDiv.innerHTML = `<span class='glyphicon glyphicon-remove text-danger'></span> ${task.name}`;
		}
		
		editButton.innerHTML = `Edytuj <span class='glyphicon glyphicon-chevron-right'></span>`;
		searchButton.innerHTML = `Podgląd <span class='glyphicon glyphicon-search'></span>`;
		deleteButton.innerHTML = `Usuń <span class='glyphicon glyphicon-trash'></span>`;
		
		panelInfoDiv.className = 'panel panel-info';
		panelBodyDiv.className = 'panel-body';
		editButton.className = 'btn btn-primary pull-right btn-sm col-xs-12 col-sm-2';
		searchButton.className = 'btn btn-info pull-right btn-sm col-xs-12 col-sm-2';
		deleteButton.className = 'btn btn-danger pull-right btn-sm col-xs-12 col-sm-2';

		taskHolderDiv.appendChild(panelInfoDiv);
		panelInfoDiv.appendChild(panelBodyDiv);
		panelBodyDiv.appendChild(editButton);
		panelBodyDiv.appendChild(searchButton);
		panelBodyDiv.appendChild(deleteButton);


	}

	function loadingTasks() {
		let taskArrLength = taskArray.length;
		for (let i = 0; i < taskArrLength; i += 1) {
			generateTasksOnSite(taskArray[i]);
		}
	}

	function loadData() {
		if (localStorage.getItem('localStorageTaskArray')) {
			let loadedData = JSON.parse(localStorage.getItem('localStorageTaskArray'));
			id = loadedData.id;
			taskArray = loadedData.taskArray;

			loadingTasks();
		}
	}

	loadData();

	function getActualTime() {
		let actualDate = new Date(),
			readActualDate = actualDate.toLocaleString();
		return readActualDate;
	}

	function getTaskName() {
		let newTaskName = document.querySelector('#newTaskName').value;
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
		constructor(_taskId, _taskName, _created, _status) {
			this.id = _taskId;
			this.name = _taskName;
			this.description = _taskName;
			this.created = _created;
			this.status = _status;
			this.lastEdit = _created;
			this.deadline = _created;
		}
	}

	function generatorOfDom(parentId, type, innerHTML, className, onClickFunction, setId) {
		let whereHaveToAppearDiv = document.querySelector('#' + parentId),
			objectOfDom = document.createElement(type);

		if (innerHTML) {
			objectOfDom.innerHTML = innerHTML;
		}

		if (className) {
			objectOfDom.className = className;
		}

		if (onClickFunction) {
			objectOfDom.onclick = onClickFunction;
		}

		if (setId) {
			objectOfDom.id = setId;
		}

		whereHaveToAppearDiv.appendChild(objectOfDom);

	}

	function addNewTask() {
		if (document.querySelector('#newTaskName').value) {
			let newTask = new Task(getTaskID(), getTaskName(), getActualTime(), false);
			saveTask(newTask);
			refreshTasks();	
		}
	}
	
	newTaskButton.addEventListener('click', addNewTask);
	sortButton.addEventListener('click',whatSortButtonWasClicked, false);

});
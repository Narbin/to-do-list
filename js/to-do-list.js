document.addEventListener('DOMContentLoaded',() => {

	let newTaskButton = document.querySelector('#addTask'),
		id = 0,
		taskArray = [ ];

		

	if(localStorage.getItem('localStorageTaskArray')){
		loadedData = JSON.parse(localStorage.getItem('localStorageTaskArray'));
		id = loadedData.id;
		taskArray = loadedData.taskArray;

		loadingTasks();
	}


	newTaskButton.addEventListener('click', addNewTask);


	function loadingTasks(){
		taskArrLength = taskArray.length;
		for(let i = 0;i < taskArray.length;i+=1){
			generateTasksOnSite(taskArray[i]);
		}
	}

	function deleteTask(task){
		if(confirm("Napewno chcesz usunąć zadanie??") === true){
			taskDiv = document.querySelector(`[id='${task.id}']`);
			taskDiv.parentNode.removeChild(taskDiv);
			taskArray.splice(taskArray.indexOf(task), 1);
			saveActualData();
			
		}
	}

	
	function addNewTask(){
		if(document.querySelector('#newTaskName').value){
			let newTask = new Task(getTaskID(),getTaskName(),getActualTime(),false);
			saveTask(newTask);
			generateTasksOnSite(newTask);
		}
	}

	function getActualTime(){
		let actualDate = new Date(),
		readActualDate = actualDate.toLocaleString();
		return readActualDate
	}

	function getTaskName(){
		let newTaskName = document.querySelector('#newTaskName').value;
		return newTaskName
	}

	function getTaskID(){
		id += 1;
		return id
	}

	function saveTask(task){
		taskArray.push(task);
		saveActualData();
	}

	function saveActualData(){
		localStorage.setItem('localStorageTaskArray', JSON.stringify({
			id: id,
			taskArray: taskArray
		}));
	}

	class Task {
		constructor(_taskId, _taskName, _created, _status){
			this.id = _taskId
			this.name = _taskName;
			this.created = _created;
			this.status = _status;
		}
	}

	function generateTasksOnSite(task){

		let taskHolderDiv = document.querySelector('#taskHolder');

		let panelInfoDiv = document.createElement('div'),
			panelBodyDiv = document.createElement('div'),
			editButton = document.createElement('button'),
			searchButton = document.createElement('button'),
			deleteButton = document.createElement('button');

		panelInfoDiv.id = task.id;

		deleteButton.onclick = function() {
			deleteTask(task);
		};

		panelBodyDiv.innerHTML = `<span class="glyphicon glyphicon-remove text-danger"></span> ${task.name}`;
		editButton.innerHTML = `Edytuj <span class="glyphicon glyphicon-chevron-right"></span>`;
		searchButton.innerHTML = `Podgląd <span class="glyphicon glyphicon-search"></span>`;
		deleteButton.innerHTML = `Usuń <span class="glyphicon glyphicon-trash"></span>`;
		
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
});

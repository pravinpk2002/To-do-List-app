const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

async function addTask() {
    if (inputBox.value === '') {
        alert('You must write something');
        return;
    }

    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: inputBox.value }),
    });

    const task = await response.json();
    renderTask(task); 
    inputBox.value = '';
}


listContainer.addEventListener("click", async function (e) {
    
    if (e.target.tagName === "LI") {
        const li = e.target;
        const taskId = li.getAttribute("data-id"); 

       
        const isChecked = li.classList.toggle("checked");

        
        await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_checked: isChecked }),
        });
    }

    
    if (e.target.tagName === "SPAN") {
        const li = e.target.parentElement;
        const taskId = li.getAttribute("data-id");

       
        await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' });

        
        li.remove();
    }
});


async function showTask() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    listContainer.innerHTML = ''; 
    tasks.forEach(renderTask); 
}


function renderTask(task) {
    const li = document.createElement('li');
    li.textContent = task.task;
    li.setAttribute("data-id", task.id); 

    if (task.is_checked) li.classList.add('checked');

    const span = document.createElement('span');
    span.textContent = '\u00d7'; 
    li.appendChild(span);

    listContainer.appendChild(li);
}


showTask();

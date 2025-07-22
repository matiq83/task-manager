document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');

    function loadTasks() {
        fetch('api/tasks.php')
            .then(res => res.json())
            .then(tasks => {
                if (tasks.length) {
                    // Add heading row
                    taskList.innerHTML = `
                        <li class="list-group-item d-flex fw-bold bg-light not-sortable mb-3 rounded">
                            <div class="col-title flex-grow-1">Title</div>
                            <div class="col-status">Status</div>
                            <div class="col-actions">Actions</div>
                        </li>
                    `;
                } else {
                    taskList.innerHTML = '';
                }
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2 task-status-' + task.status;
                    li.dataset.id = task.id;
                    li.innerHTML = `
                        <div class="d-flex align-items-center flex-grow-1 col-title">
                            <span class="task-title${task.status === 'done' ? ' text-decoration-line-through text-muted' : ''}">${task.title}</span>
                        </div>
                        <div class="col-status">
                            <select class="form-select form-select-sm status-select">
                                <option value="to-do" ${task.status === 'to-do' ? 'selected' : ''}>To-Do</option>
                                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In-Progress</option>
                                <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
                            </select>
                        </div>
                        <div class="d-flex gap-2 col-actions">
                            <button class="btn btn-secondary edit-btn">Edit</button>
                            <button class="btn btn-danger delete-btn">Delete</button>
                        </div>
                    `;
                    taskList.appendChild(li);
                });
            });
    }

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        fetch('api/tasks.php', {
            method: 'POST',
            body: JSON.stringify({
                title: titleInput.value,
                sort_order: taskList.children.length - 1 // -1 for heading row
            })
        }).then(() => {
            titleInput.value = '';
            loadTasks();
        });
    });

    taskList.addEventListener('click', function (e) {
        // Delete functionality
        if (e.target.classList.contains('delete-btn')) {
            if (confirm("Are you sure you want to delete it?")) {
                const li = e.target.closest('li');
                if (li && li.dataset.id) {
                    const id = li.dataset.id;
                    fetch('api/tasks.php', {
                        method: 'DELETE',
                        body: `id=${id}`
                    }).then(loadTasks);
                }
            }
        }

        // Edit functionality
        if (e.target.classList.contains('edit-btn')) {
            const li = e.target.closest('li');
            if (!li || !li.dataset.id) return;
            const id = li.dataset.id;
            const titleSpan = li.querySelector('.task-title');
            const currentTitle = titleSpan.textContent;

            // Replace title with input
            titleSpan.outerHTML = `<input type="text" class="form-control form-control-sm edit-title-input" value="${currentTitle}">`;
            e.target.textContent = 'Save';
            e.target.classList.remove('edit-btn');
            e.target.classList.add('save-btn');

            // Add Enter key save functionality
            const input = li.querySelector('.edit-title-input');
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
            input.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    const status = li.querySelector('.status-select').value;
                    const newTitle = input.value.trim();
                    if (!newTitle) return;
                    fetch('api/tasks.php', {
                        method: 'PATCH',
                        body: JSON.stringify({
                            id: id,
                            title: newTitle,
                            status: status,
                        })
                    }).then(() => {
                        loadTasks();
                    });
                }
            });
        } else if (e.target.classList.contains('save-btn')) {
            const li = e.target.closest('li');
            if (!li || !li.dataset.id) return;
            const id = li.dataset.id;
            const status = li.querySelector('.status-select').value;
            const input = li.querySelector('.edit-title-input');
            const newTitle = input.value.trim();
            if (!newTitle) return;

            fetch('api/tasks.php', {
                method: 'PATCH',
                body: JSON.stringify({
                    id: id,
                    title: newTitle,
                    status: status,
                })
            }).then(() => {
                loadTasks();
            });
        }
    });

    // Status change functionality (dropdown)
    taskList.addEventListener('change', function (e) {
        if (e.target.classList.contains('status-select')) {
            const li = e.target.closest('li');
            if (!li || !li.dataset.id) return;
            const id = li.dataset.id;
            const title = li.querySelector('.task-title') ? li.querySelector('.task-title').innerText : '';
            const newStatus = e.target.value;
            fetch('api/tasks.php', {
                method: 'PATCH',
                body: JSON.stringify({
                    id: id,
                    status: newStatus,
                    title: title
                })
            }).then(() => {
                loadTasks();
            });
        }
    });

    new Sortable(taskList, {
        animation: 150,
        filter: '.not-sortable',
        preventOnFilter: false,
        onMove: function (evt) {
            // Prevent sorting if the dragged or target item is the heading row
            return !evt.related.classList.contains('not-sortable') && !evt.dragged.classList.contains('not-sortable');
        },
        onEnd: function () {
            // Exclude heading row from order
            const order = Array.from(taskList.children)
                .filter(li => li.dataset.id)
                .map(li => li.dataset.id);
            fetch('api/tasks.php', {
                method: 'PATCH',
                body: JSON.stringify({ order })
            });
        }
    });

    loadTasks();
});
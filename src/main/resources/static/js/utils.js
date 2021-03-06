//todos initialization
function initTodos() {
    var checkInputs = todosList.getElementsByClassName('custom-checkbox_target');
    for (let i = 0; i < checkInputs.length; i++) {
        addCheckInputEL(checkInputs[i]);
    }
    var removeButtons = todosList.getElementsByClassName('todos-list_item_remove');
    for (let i = 0; i < removeButtons.length; i++) {
        addRemoveBtnEL(removeButtons[i]);
    }
}

//ui and filter functions
function updateListByFilter() {
    switch (currentFilter) {
        case filters[0] : {
            for (let i = 0; i < todosList.children.length; i++) {
                todosList.children[i].style.display = 'block';
            }
            break;
        }
        case filters[1] : {
            for (let i = 0; i < todosList.children.length; i++) {
                if (!todosList.children[i].classList.contains('__done')) {
                    todosList.children[i].style.display = 'block';
                } else {
                    todosList.children[i].style.display = 'none';
                }
            }
            break;
        }
        case filters[2] : {
            for (let i = 0; i < todosList.children.length; i++) {
                if (todosList.children[i].classList.contains('__done')) {
                    todosList.children[i].style.display = 'block';
                } else {
                    todosList.children[i].style.display = 'none';
                }
            }
            break;
        }
    }
}

function showHideToolbar() {
    if (allCounter === 0) {
        todosToolbar.style.display = 'none';
        checkAll.style.display = 'none';
    } else {
        todosToolbar.style.display = 'block';
        checkAll.style.display = 'block';
    }
}

function changeCounter(count) {
    leftCounter += count;
    if (leftCounter === 0) {
        checkAll.style.visibility = 'hidden';
    } else {
        checkAll.style.visibility = 'visible';
    }
    taskCounter.innerHTML = leftCounter + ' items left';
}

function clearCompleted() {
    for (var i = 0; i < todosList.children.length; i++) {
        if (todosList.children[i].classList.contains('__done')) {
            request(API_DELETE, 'DELETE', JSON.stringify({
                id: todosList.children[i].getAttribute('id')
            }), function (response) {
                if (response !== null) {
                    todosList.removeChild(document.getElementById(response.id));
                    allCounter -= 1;
                    i--;
                    showHideToolbar(); //needs to be there cause of async
                }
            });
        }
    }
}

//make some item done function
function makeItemDone(item) {
    request(API_UPDATE, 'PUT', JSON.stringify({
        id: item.getAttribute('id'),
        description: null,
        done: true
    }), function (response) {
        if (response === true) {
            if (!item.classList.contains("__done")) {
                item.classList.add("__done");
                changeCounter(-1);
            }
            item.getElementsByClassName("custom-checkbox_target")[0].checked = true;
            updateListByFilter();
        }
    });
}

//add event listeners functions
function addCheckInputEL(checkInput) {
    checkInput.addEventListener('click', function (ev) {
        request(API_UPDATE, 'PUT', JSON.stringify({
            id: ev.target.closest(".todos-list_item").getAttribute('id'),
            description: null,
            done: ev.target.checked
        }), function (response) {
            if (response === true) {
                var item = ev.target.closest(".todos-list_item");
                if (ev.target.checked === true) {
                    if (!item.classList.contains('__done')) {
                        item.classList.add('__done');
                    }
                    changeCounter(-1);
                } else {
                    if (item.classList.contains('__done')) {
                        item.classList.remove('__done');
                    }
                    changeCounter(1);
                }
                updateListByFilter();
            }
        });
    });
}

function addRemoveBtnEL(removeBtn) {
    removeBtn.addEventListener('click', function (ev) {
        request(API_DELETE, 'DELETE', JSON.stringify({
            id: ev.target.closest(".todos-list_item").getAttribute('id')
        }), function (response) {
            if (response !== null) {
                if (!ev.target.closest('.todos-list_item').classList.contains('__done')) {
                    changeCounter(-1);
                }
                allCounter += -1;
                todosList.removeChild(ev.target.closest('.todos-list_item'));
                showHideToolbar();
            }
        });
    });
}
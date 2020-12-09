import './scss/app.scss';

import React from 'react';
import search from './assets/search.svg';
import filter from './assets/filter.svg';
import sort from './assets/sort.svg';

import { AddPopup, Task } from './components';

// const task = {
//   id: 1,
//   name: 'Купить хлеба',
//   status: 'new',
//   date: '--date--',
//   tags: ['#первый', '#второй'],
// };

const FilterOptionsMap = {
  'все задачи': () => true,
  'только выполненные': (status) => status === 'completed',
  'только без статуса': (status) => status === 'new',
  'только в прогессе': (status) => status === 'in-progress',
  'только отменённые': (status) => status === 'canceled',
};

const OrderOptionsMap = {
  'по дате: новые': (a, b) => b.id - a.id,
  'по дате: старые': (a, b) => a.id - b.id,
};

/**
 * Return next key in Object.keys(yourObject)
 *
 * @map - must be a {object}
 * @key - must be a key in object
 *
 * if @key is last - return first key
 *
 */
const getNextShiftKey = (map, key) => {
  const keys = Object.keys(map);
  const index = keys.indexOf(key);
  const next = index === keys.length - 1 ? keys[0] : keys[index + 1];
  return next;
};

// TODO: Добавить возможность выбора тега
// TODO: Добавить хранение в localStorage
function App() {
  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const [maxId, setMaxId] = React.useState(null);
  const [filterOption, setFilterOption] = React.useState(
    Object.keys(FilterOptionsMap)[0]
  );
  const [orderOption, setOrderOption] = React.useState(
    Object.keys(OrderOptionsMap)[0]
  );
  const [taskList, setTaskList] = React.useState([]);
  const [searchTaskName, setSearchTaskName] = React.useState('');

  React.useEffect(() => {
    const storageTasks = JSON.parse(localStorage.getItem('tasks'));
    const storageMaxId = localStorage.getItem('maxId');

    setTaskList(storageTasks);
    setMaxId(storageMaxId);
  }, []);

  /**
   * Update task list state, and localStorage
   *
   * @option can be 'add' or 'delete' or 'updateStatus' {string};
   * @data must be a task {object} if it add option,
   *                   id {string} if it delete option or update option
   *
   * Examples:
   *
   * onUpdateTaskList('add', {id: 1, name: "some task name", status: 'new', date: 'some date', tags: ['#tag1, #tag2']})
   * onUpdateTaskList('delete', 2)
   * onUpdateTaskList('update', 2, 'in-progress')
   *
   */
  const onUpdateTaskList = (option, data, status) => {
    let newTaskList = null;
    switch (option) {
      case 'add':
        console.log(taskList);
        newTaskList = taskList ? [...taskList, data] : [data];
        setTaskList(newTaskList);
        setMaxId(maxId + 1);

        localStorage.setItem('tasks', JSON.stringify(newTaskList));
        localStorage.setItem('maxId', maxId);
        break;

      case 'delete':
        newTaskList = taskList.filter((task) => task.id !== data);
        setTaskList(newTaskList);

        localStorage.setItem('tasks', JSON.stringify(newTaskList));
        break;

      case 'updateStatus':
        const updatedTask = taskList.filter((task) => task.id === data);
        updatedTask[0].status = status;
        newTaskList = [
          ...taskList.filter((task) => task.id !== data),
          updatedTask[0],
        ];
        setTaskList(newTaskList);

        localStorage.setItem('tasks', JSON.stringify(newTaskList));
        break;

      default:
        break;
    }
  };

  const onChangeFilterOption = () => {
    setFilterOption(getNextShiftKey(FilterOptionsMap, filterOption));
  };

  const onChangeOrderOption = () => {
    setOrderOption(getNextShiftKey(OrderOptionsMap, orderOption));
  };

  const onChangeSearchText = (e) => {
    setSearchTaskName(e.target.value);
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="search-panel">
            <div className="input__container">
              <input
                type="text"
                className="input search-input"
                onChange={onChangeSearchText}
              />
              <img className="search-img" src={search} alt="" />
            </div>
            <button
              className="button button-main"
              onClick={() => setVisiblePopup(true)}
            >
              Добавить
            </button>
          </div>
          <div className="sieve">
            <div className="filter" onClick={onChangeFilterOption}>
              <img src={filter} alt="" />
              <span className="filter__text sieve-text">{filterOption}</span>
            </div>
            <div className="sort" onClick={onChangeOrderOption}>
              <img src={sort} alt="" />
              <span className="sort__text sieve-text">{orderOption}</span>
            </div>
          </div>
          <div className="tasks-list">
            {taskList &&
              taskList
                .sort((a, b) => OrderOptionsMap[orderOption](a, b))
                .filter((task) => FilterOptionsMap[filterOption](task.status))
                .filter((task) =>
                  task.name
                    .toLowerCase()
                    .startsWith(searchTaskName.toLowerCase())
                )
                .map((task) => {
                  return (
                    <Task
                      key={`${task.id}`}
                      status={task.status}
                      name={task.name}
                      // TODO: Add date label
                      // date={task.date}
                      tags={task.tags}
                      onDeleteTask={() => onUpdateTaskList('delete', task.id)}
                      onChangeStatus={(status) =>
                        onUpdateTaskList('updateStatus', task.id, status)
                      }
                    />
                  );
                })}
          </div>
        </div>
      </div>
      {visiblePopup && (
        <AddPopup
          onHidePopup={() => setVisiblePopup(false)}
          maxId={maxId}
          onCreateTask={(newTask) => {
            setVisiblePopup(false);
            onUpdateTaskList('add', newTask);
          }}
        />
      )}
    </>
  );
}

export default App;

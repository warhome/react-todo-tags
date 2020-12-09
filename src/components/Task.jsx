import React from 'react';
import classNames from 'classnames';
import { Tag, Status } from '../components';

import del from '../assets/delete.svg';

function Task({ status, name, date, tags, onDeleteTask, onChangeStatus }) {
  return (
    <div className={classNames('task', `task_${status}`)}>
      <div className="task__container">
        <span className="task-name">{name}</span>
        <div className="tag-list">
          {tags &&
            tags.map((name, index) => (
              <Tag key={`${name}${index}`} name={name} />
            ))}
        </div>
        <Status
          statusType={status}
          onChangeStatusType={(status) => onChangeStatus(status)}
        />
        <span className="date">{date}</span>
      </div>
      <img
        className="delete"
        src={del}
        alt="Delete forever"
        onClick={() => onDeleteTask()}
      />
    </div>
  );
}

export default Task;

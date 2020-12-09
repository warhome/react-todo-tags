import React from 'react';
import classNames from 'classnames';

const statusNames = {
  new: 'Без статуса',
  'in-progress': 'В процессе',
  completed: 'Выполнено',
  canceled: 'Отменено',
};

function Status({ statusType, onChangeStatusType }) {
  const onChangeStatus = () => {
    const keys = Object.keys(statusNames);
    const statusIndex = keys.indexOf(statusType);
    const newStatus =
      statusIndex === keys.length - 1 ? keys[0] : keys[statusIndex + 1];
    onChangeStatusType(newStatus);
  };
  return (
    <div
      className={classNames('status', `status_${statusType}`)}
      onClick={onChangeStatus}
    >
      <span className="status__type">{statusNames[statusType]}</span>
    </div>
  );
}

export default Status;

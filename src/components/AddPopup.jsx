import React from 'react';
import { Tag, Status } from '../components';

const REGEX_TAG = /#(.*?)\s/g;

function AddPopup({ onHidePopup, onCreateTask, maxId }) {
  const [taskName, setTaskName] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [status, setStatus] = React.useState('new');

  const onChangeTaskName = (e) => {
    const value = e.target.value;
    const tags =
      value.match(REGEX_TAG) === null
        ? null
        : value.match(REGEX_TAG).slice(0, 3);

    setTaskName(value);
    setTags(tags);
  };

  const clearTags = (str) => str.replace(REGEX_TAG, '');

  return (
    <div className="add-popup">
      <div className="add-popup__form">
        <div className="input-and-buttons">
          <input
            type="text"
            value={taskName}
            placeholder="Название задачи с #тег-первый #тег-второй"
            className="input task-name-input"
            onChange={onChangeTaskName}
          />
          <button
            className="button button-main popup-btn"
            onClick={() =>
              onCreateTask({
                id: maxId + 1,
                name: clearTags(taskName),
                status: status,
                tags: tags,
              })
            }
          >
            Сохранить
          </button>
          <button
            className="button button-cancel popup-btn"
            onClick={() => onHidePopup()}
          >
            Отмена
          </button>
        </div>
        <div className="status-and-tags">
          <Status
            statusType={status}
            onChangeStatusType={(newStatus) => setStatus(newStatus)}
          />
          <div className="tag-list">
            {tags &&
              tags.map((tag, index) => (
                <Tag key={`${tag}${index}`} name={tag} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPopup;

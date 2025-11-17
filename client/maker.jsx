// client/maker.jsx
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;
  const height = e.target.querySelector('#domoHeight').value;
  const level = e.target.querySelector('#domoLevel').value;

  if (!name || !age || !height || !level) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { name, age, height, level }, onDomoAdded);
  return false;
};

const DomoForm = (props) => {
  return (
    <form
      id="domoForm"
      name="domoForm"
      onSubmit={(e) => handleDomo(e, props.triggerReload)}
      action="/maker"
      method="POST"
      className="domoForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />

      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="number" name="age" min="0" />

      <label htmlFor="height">Height: </label>
      <input id="domoHeight" type="number" name="height" min="0" />

      <label htmlFor="level">Level: </label>
      <input id="domoLevel" type="number" name="level" min="1" />

      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = (props) => {
  const [domos, setDomos] = useState([]);

  const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    setDomos(data.domos);
  };

  useEffect(() => {
    loadDomosFromServer();
  }, [props.reloadDomos]);

  const deleteDomo = (id) => {
    helper.sendPost('/deleteDomo', { id }, props.triggerReload);
  };

  if (!domos || domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }

  const domoNodes = domos.map((domo) => {
    return (
      <div className="domo" key={domo._id}>
        <img
          src="/assets/img/domoface.jpeg"
          alt="domo face"
          className="domoFace"
        />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoHeight">Height: {domo.height}</h3>
        <h3 className="domoLevel">Level: {domo.level}</h3>
        <button
          className="domoDelete"
          type="button"
          onClick={() => deleteDomo(domo._id)}
        >
          Delete
        </button>
      </div>
    );
  });

  return <div className="domoList">{domoNodes}</div>;
};

const App = () => {
  const [reloadDomos, setReloadDomos] = useState(false);

  const triggerReload = () => {
    setReloadDomos(!reloadDomos);
  };

  return (
    <>
      <DomoForm triggerReload={triggerReload} />
      <DomoList reloadDomos={reloadDomos} triggerReload={triggerReload} />
    </>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;

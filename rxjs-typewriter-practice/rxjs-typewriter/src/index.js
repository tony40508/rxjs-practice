import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { componentFromStream, setObservableConfig } from 'recompose';
import { Observable } from 'rxjs';
// import { map, switchMap } from 'rxjs/operators';
// import rxjsConfig from 'recompose/rxjsObservableConfig';
import * as serviceWorker from './serviceWorker';

/* rxjs v6 has bug */
setObservableConfig({
  fromESObservable: Observable.from,
  toESObservable: x => x,
});

const createTypeWriter = (message, speed) =>
  Observable.zip(
    Observable.from(message),
    Observable.interval(speed),
    letter => letter,
  ).scan((acc, curr) => acc + curr);

const StreamingApp = componentFromStream(props$ =>
  props$
    .switchMap(props => createTypeWriter(props.message, props.speed))
    .map(message => ({ message }))
    .map(App),
);

const root = document.getElementById('root');

setInterval(() => {
  ReactDOM.render(
    <StreamingApp message="React Happy Hacking!" speed={100} />,
    root,
  );
}, 3000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import ReactDOM from 'react-dom';
import store from "./store";
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Provider} from "react-redux";
import {ErrorTemplate} from "./components/ErrorTemplate";
import {CreatePage} from "./components/CreatePage";
import {MainPage} from "./components/MainPage";
import MapPage from "./components/MapPage";
import {MAP_ID_REGEX} from "./const";

(async () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MainPage/>
                    </Route>
                    <Route exact path="/create">
                        <CreatePage/>
                    </Route>
                    <Route path={`/:mapId(${MAP_ID_REGEX})`}>
                        <MapPage/>
                    </Route>
                    <Route>
                        <ErrorTemplate errors={["Страница не найдена"]}/>
                    </Route>
                </Switch>
            </Router>
        </Provider>,
        document.getElementById('root')
    );
})();

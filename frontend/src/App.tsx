import './css/style.css'

import store from './store'
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import {ErrorTemplate} from './components/ErrorTemplate'
import {CreatePage} from './components/pages/CreatePage'
import {MainPage} from './components/pages/MainPage'
import MapPage from './components/pages/MapPage'
import {MAP_ID_REGEX} from './const'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {noop} from './util'
import {getTheme, Theme} from "./components/Themes";
import {EditPage} from "./components/pages/EditPage";
import {MapListPage} from "./components/pages/MapListPage";
import {Page} from "./components/pages/Page";
import {AboutPage} from "./components/pages/AboutPage";
import {LoginPage} from "./components/pages/LoginPage";
import {MantineProvider} from '@mantine/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {Errors} from './model/model'

dayjs.locale('ru-RU')
dayjs.extend(customParseFormat)

export const App: React.FC = () => {
    const fallBackComponent = ({error}: FallbackProps) => <ErrorTemplate
        errors={[Errors.FRONTEND_IS_BROKEN(`${error.name}: ${error.message}}}`)]}
        stackTrace={error.stack}
    />

    const defaultTheme = getTheme(Theme.DEFAULT)
    document.documentElement.style.setProperty('--themed-background', defaultTheme.background);
    document.documentElement.style.setProperty('--themed-foreground', defaultTheme.foreground);
    document.documentElement.style.setProperty('--themed-link', defaultTheme.link);
    // TODO: cursed

    return <React.StrictMode>
        <Provider store={store}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={defaultTheme}
            >
                <ErrorBoundary onReset={noop} FallbackComponent={fallBackComponent}>
                    <Router>
                        <Switch>
                            <Route exact path="/">
                                <Page childComponent={<MainPage/>}/>
                            </Route>
                            <Route exact path="/create">
                                <Page childComponent={<CreatePage/>}/>
                            </Route>
                            <Route path={`/:mapId(${MAP_ID_REGEX})/edit`}>
                                <Page childComponent={<EditPage/>}/>
                            </Route>
                            <Route path={`/:mapId(${MAP_ID_REGEX})`}>
                                <MapPage/>
                            </Route>
                            <Route exact path="/maplist">
                                <Page childComponent={<MapListPage/>}/>
                            </Route>
                            <Route exact path="/login">
                                <Page childComponent={<LoginPage/>}/>
                            </Route>
                            <Route exact path="/about">
                                <Page childComponent={<AboutPage/>}/>
                            </Route>
                            <Route>
                                <Page childComponent={<ErrorTemplate errors={['Страница не найдена']}/>}/>
                            </Route>
                        </Switch>
                    </Router>
                </ErrorBoundary>
            </MantineProvider>
        </Provider></React.StrictMode>
}

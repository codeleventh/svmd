import './css/map/leaflet.css'
import './css/reset.css'
import './css/style.css'

import store from './store'
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import {ErrorTemplate} from './components/ErrorTemplate'
import {CreatePage} from './components/CreatePage'
import {MainPage} from './components/MainPage'
import MapPage from './components/MapPage'
import {DARK_THEME, MAP_ID_REGEX} from './const'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {noop} from './util'
import {MantineProvider} from '@mantine/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {Errors} from './model'

dayjs.locale('ru-RU')
dayjs.extend(customParseFormat)

export const App: React.FC = () => {
	const fallBackComponent = ({error}: FallbackProps) => <ErrorTemplate
		errors={[Errors.FRONTEND_IS_BROKEN(`${error.name}: ${error.message}}}`)]}
		stackTrace={error.stack}
	/>

	return <React.StrictMode><Provider store={store}>
		<MantineProvider
			withGlobalStyles
			theme={DARK_THEME}>
			<ErrorBoundary onReset={noop} FallbackComponent={fallBackComponent}>
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
							<ErrorTemplate errors={['Страница не найдена']}/>
						</Route>
					</Switch>
				</Router>
			</ErrorBoundary>
		</MantineProvider>
	</Provider></React.StrictMode>
}

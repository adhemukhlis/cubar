import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import configureStore from '@/src/store'
import { PersistGate } from 'redux-persist/integration/react'
import App from '@/src/App'
import Loader from '@/src/components/Loader'

const { store, persistor } = configureStore()

const EntryPoint = () => {
	console.log(
		`%c ENTRYPOINT MOUNTED`,
		`color:#83EEFF; background-color: transparent; padding:10px; border: 2px dashed #83EEFF; border-radius: 0.8em;`
	)

	const LoaderIndicator = () => {
		return (
			<div style={{ height: '100vh' }}>
				<Loader />
			</div>
		)
	}

	return (
		<Suspense fallback={<LoaderIndicator />}>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<GoogleOAuthProvider clientId="111396317998-93tt1qr1liirbd6qhbeklaghcbs184s1.apps.googleusercontent.com">
						<App />
					</GoogleOAuthProvider>
				</PersistGate>
			</Provider>
		</Suspense>
	)
}

export default EntryPoint

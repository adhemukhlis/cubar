import React from 'react'
import ReactDOM from 'react-dom/client'
import * as serviceWorker from '@/src/serviceWorker'
import EntryPoint from '@/src/EntryPoint'
import '@/src/index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<EntryPoint />)

serviceWorker.register({
	onUpdate: (registration) => {
		alert('New version available!  Ready to update?')
		window.location.reload()
		if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: 'SKIP_WAITING' })
			registration.waiting.addEventListener('statechange', (e) => {
				if (e.target.state === 'activated') {
					window.location.reload()
				}
			})
		}
	}
})

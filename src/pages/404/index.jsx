const Page404 = () => {
	const onBack = () => {
		window.history.back()
	}
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
			<h1>404 | not found at </h1>
			<code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.8em', borderRadius: '0.6em' }}>{window.location.href}</code>
			<button onClick={onBack}>Back</button>
		</div>
	)
}
export default Page404

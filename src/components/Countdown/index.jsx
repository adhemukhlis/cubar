import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { CountdownText, CountdownGame } from '@/src/styles/styles'

const Countdown = ({ a, b, onRest }) => {
	const data = {
		labels: ['', ''],
		datasets: [
			{
				data: [b - a, a],
				backgroundColor: ['#FF6384', '#36A2EB'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB']
			}
		]
	}
	return (
		<div style={onRest ? { width: '60px' } : CountdownGame}>
			<div style={CountdownText}>
				<span style={{ fontSize: '24px' }}>{a + 1}</span>
			</div>
			<Doughnut
				height={60}
				options={{
					maintainAspectRatio: false,
					legend: {
						display: false
					}
				}}
				data={data}
			/>
		</div>
	)
}

export default Countdown

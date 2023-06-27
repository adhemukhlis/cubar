import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { CountdownText, ScoreGame } from '@/src/styles/styles'

const Score = ({ a, b }) => {
	const data = {
		labels: ['Benar : ' + a, 'Salah  : ' + b],
		datasets: [
			{
				data: [a, b],
				backgroundColor: ['#36A2EB', '#FF6384'],
				hoverBackgroundColor: ['#36A2EB', '#FF6384']
			}
		]
	}
	return (
		<div style={ScoreGame}>
			<div style={CountdownText}>
				<span style={{ fontSize: '24px' }}>{a - b}</span>
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

export default Score

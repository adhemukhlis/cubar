import React, { useState, useEffect, memo } from 'react'
import Countdown from '@/src/components/Countdown'
import Score from '@/src/components/Score'
import { IcRegularQuestionSquare } from '@/src/styles/react-icon-svg'
import Button3d from '@/src/components/3d-button/3d-button'
import {
	ButtonFontSize,
	ButtonSimStyle,
	ChalStyle,
	ContainerCenterBasic,
	IconSizeQuestion,
	ScoreGame
} from '@/src/styles/styles'
import randValue from '@/src/utils/randValue'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import { motion } from 'framer-motion'
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration)

const Simplicity = () => {
	const [isCorrect, setIsCorrect] = useState(undefined)
	const [benar, setBenar] = useState(0)
	const [salah, setSalah] = useState(0)
	const [visible, setVisible] = useState(true)
	const [indexSoal, setIndexSoal] = useState(0)
	const [endOfCoolDown, setEndOfCoolDown] = useState(undefined)
	const [endAt, setEndAt] = useState(dayjs().add(30000, 'ms'))
	const [coolDownTime, setCoolDownTime] = useState(undefined)

	const soal = [
		{
			options: [0, 1, 4],
			question: '1+1',
			answer: 2
		},
		{
			options: [2, 3, 4],
			question: '(1+1)/2',
			answer: 1
		},
		{
			options: [3, 7, 10],
			question: '5-(1x1)',
			answer: 4
		},
		{
			options: [2, 5, 6],
			question: '4/(1-1)',
			answer: 0
		},
		{
			options: [3, 5, 7],
			question: '6x2',
			answer: 12
		},
		{
			options: [2, 17, 60],
			question: '12-5',
			answer: 7
		}
	]
	const plusPoint = () => {
		setBenar((prev) => prev + 1)
		setIsCorrect(true)
		setVisible((prev) => !prev)
		randValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}
	const minPoint = () => {
		setSalah((prev) => prev + 1)
		setIsCorrect(false)
		setVisible((prev) => !prev)
	}
	const check = (val) => {
		if (val === soal[indexSoal].answer) {
			plusPoint()
		} else {
			minPoint()
		}
	}
	useEffect(() => {
		randValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}, [])
	useEffect(() => {
		var gameCooldown = undefined

		if (endOfCoolDown === undefined) {
			const gameStartAt = endAt
			const waitTime = (gameStartAt.diff(dayjs(), 'ms') % 1000) - 1
			setTimeout(() => {
				setEndOfCoolDown(gameStartAt.subtract(waitTime, 'ms'))
			}, waitTime)
		} else {
			gameCooldown = setInterval(() => {
				const secondRemaining = endOfCoolDown.diff(dayjs(), 's')
				if (secondRemaining < 0) {
					if (getDuration() > 0) {
						setEndOfCoolDown(dayjs().add(getDuration(), 'ms'))
					} else {
						clearInterval(gameCooldown)
					}
				} else {
					setCoolDownTime(secondRemaining)
				}
			}, 1000)
		}

		return () => clearInterval(gameCooldown)
	}, [endOfCoolDown])

	const getDuration = () => {
		return endAt.diff(dayjs(), 'ms')
	}

	return (
		<div style={ContainerCenterBasic}>
			<Countdown a={coolDownTime ?? 0} b={30} />
			<div style={ScoreGame}>
				<Score a={benar} b={salah} />
			</div>
			<motion.div
				key={benar}
				style={ChalStyle}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 0.8,
					delay: 0.2,
					ease: [0, 0.71, 0.2, 1.01]
				}}>
				<span className="prevent-select">{soal[indexSoal].question}=</span>
				<IcRegularQuestionSquare height={IconSizeQuestion} />
			</motion.div>
			<OptionsMemo soal={soal} indexSoal={indexSoal} check={check} salah={salah} />
		</div>
	)
}
const OptionsMemo = memo(
	({ soal, indexSoal, check }) => {
		return [...soal[indexSoal].options, soal[indexSoal].answer]
			.sort(() => 0.5 - Math.random())
			.map((number, n) => (
				<Button3d key={n} style={ButtonSimStyle} onClick={() => check(number)}>
					<span style={ButtonFontSize} className="prevent-select">
						{number}
					</span>
				</Button3d>
			))
	},
	(prevProps, nextProps) =>
		!['soal', 'indexSoal', 'salah'].map((item) => isEqual(prevProps[item], nextProps[item])).includes(false)
)
export default Simplicity

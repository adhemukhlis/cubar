import React, { useState, useEffect, memo } from 'react'
import Countdown from '../../component/countdown'
import Score from '../../component/score'
import { Transition } from 'semantic-ui-react'
import { IcRegularQuestionSquare } from '../../icons/react-icon-svg'
import Button3d from '../../component/3d-button/3d-button'
import {
	ButtonFontSize,
	ButtonSimStyle,
	ChalStyle,
	ContainerCenterBasic,
	IconSizeQuestion,
	ScoreGame
} from '../../config/styles'
import { ConfigTransition } from '../../config/config'
import { RandValue } from '../../lib/func'
import moment from 'moment'
import { isEqual } from 'lodash'

const Simplicity = () => {
	const [isCorrect, setIsCorrect] = useState(undefined)
	const [benar, setBenar] = useState(0)
	const [salah, setSalah] = useState(0)
	const [visible, setVisible] = useState(true)
	const [indexSoal, setIndexSoal] = useState(0)
	const [endOfCoolDown, setEndOfCoolDown] = useState(undefined)
	const [endAt, setEndAt] = useState(moment().add(30000, 'ms'))
	const [coolDownTime, setCoolDownTime] = useState(undefined)

	const soal = [
		{
			fn: [0, 1, 4],
			q: '1+1',
			r: 2
		},
		{
			fn: [2, 3, 4],
			q: '(1+1)/2',
			r: 1
		},
		{
			fn: [3, 7, 10],
			q: '5-(1x1)',
			r: 4
		},
		{
			fn: [2, 5, 6],
			q: '4/(1-1)',
			r: 0
		},
		{
			fn: [3, 5, 7],
			q: '6x2',
			r: 12
		},
		{
			fn: [2, 17, 60],
			q: '12-5',
			r: 7
		}
	]
	const plusPoint = () => {
		setBenar((prev) => prev + 1)
		setIsCorrect(true)
		setVisible((prev) => !prev)
		RandValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}
	const minPoint = () => {
		setSalah((prev) => prev + 1)
		setIsCorrect(false)
		setVisible((prev) => !prev)
	}
	const check = (val) => {
		val === soal[indexSoal].r ? plusPoint() : minPoint()
	}
	useEffect(() => {
		RandValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}, [])
	useEffect(() => {
		var gameCooldown = undefined

		if (endOfCoolDown === undefined) {
			const gameStartAt = endAt
			const waitTime = (gameStartAt.diff(moment(), 'ms') % 1000) - 1
			setTimeout(() => {
				setEndOfCoolDown(gameStartAt.subtract(waitTime, 'ms'))
			}, waitTime)
		} else {
			gameCooldown = setInterval(() => {
				const secondRemaining = endOfCoolDown.diff(moment(), 's')
				if (secondRemaining < 0) {
					if (getDuration() > 0) {
						setEndOfCoolDown(moment().add(getDuration(), 'ms'))
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
		return endAt.diff(moment(), 'ms')
	}

	return (
		<div style={ContainerCenterBasic}>
			<Countdown a={coolDownTime ?? 0} b={30} />
			<div style={ScoreGame}>
				<Score a={benar} b={salah} />
			</div>
			<Transition
				animation={isCorrect ? ConfigTransition.animation[0] : ConfigTransition.animation[1]}
				duration={ConfigTransition.duration}
				visible={visible}>
				<div style={ChalStyle}>
					<span>{soal[indexSoal].q}=</span>
					<IcRegularQuestionSquare height={IconSizeQuestion} />
				</div>
			</Transition>
			<OptionsMemo soal={soal} indexSoal={indexSoal} check={check} />
		</div>
	)
}
const OptionsMemo = memo(
	({ soal, indexSoal, check }) => {
		return [...soal[indexSoal].fn, soal[indexSoal].r]
			.sort(() => 0.5 - Math.random())
			.map((number, n) => (
				<Button3d key={n} style={ButtonSimStyle} onClick={() => check(number)}>
					<span style={ButtonFontSize}>{number}</span>
				</Button3d>
			))
	},
	(prevProps, nextProps) =>
		!['soal', 'indexSoal'].map((item) => isEqual(prevProps[item], nextProps[item])).includes(false)
)
export default Simplicity

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
import { useNavigate, useLocation } from 'react-router-dom'
import URLS from '@/src/enums/urls'
import { useStore } from 'react-redux'
import GAME_GETTERS from '@/src/store/modules/Game/getters'
import USER_GETTERS from '@/src/store/modules/User/getters'
import Loader from '@/src/components/Loader'
import { gameplayDuration } from '@/src/config/config'
import { firebaseRefPlayerOnRoom, firebaseRefRoom } from '@/src/firebase-instance/firebaseRef'
import { Modal } from 'antd'
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration)
const Simplicity = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const store = useStore()
	const state = store.getState()
	const soal = GAME_GETTERS.SIMPLICITY_SOAL(state)
	const UID = USER_GETTERS.UID(state)
	const [benar, setBenar] = useState(0)
	const [salah, setSalah] = useState(0)
	const [indexSoal, setIndexSoal] = useState(0)
	const [endOfCountDown, setEndOfCountDown] = useState(undefined)
	const [countDownTime, setCountDownTime] = useState(undefined)
	const [gameData, setGameData] = useState({})
	const [roomMasterUID, setRoomMasterUID] = useState('')

	const plusPoint = () => {
		setBenar((prev) => prev + 1)
		randValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}
	const minPoint = () => {
		setSalah((prev) => prev + 1)
	}
	const check = (val) => {
		if (val === soal[indexSoal].answer) {
			plusPoint()
		} else {
			minPoint()
		}
	}
	useEffect(() => {
		firebaseRefRoom(location.state.roomCode).once('value', (snap) => {
			if (snap.exists()) {
				const { players, room_master, ...other } = snap.val()
				setGameData(other)
				setRoomMasterUID(room_master)
			} else {
				Modal.info({
					title: 'Room tidak ditemukan!',
					content: (
						<div>
							<p>Room tidak ditemukan!</p>
						</div>
					),
					onOk: () => navigate(URLS.MULTIPLAYER)
				})
			}
		})
		randValue(5, 0, indexSoal, (value) => {
			setIndexSoal(value)
		})
	}, [])
	useEffect(() => {
		let gameCountDown = undefined
		if (gameData?.current_timeline !== undefined) {
			if (endOfCountDown === undefined) {
				const gameEndAt = dayjs(gameData.timeline[gameData.current_timeline].game_start_at).add(gameplayDuration, 'ms')
				const waitTime = (gameEndAt.diff(dayjs(), 'ms') % 1000) - 1
				setTimeout(() => {
					setEndOfCountDown(gameEndAt.subtract(waitTime, 'ms'))
				}, waitTime)
			} else {
				gameCountDown = setInterval(() => {
					const waitTime = (endOfCountDown.diff(dayjs(), 'ms') % 1000) - 1
					const secondRemaining = endOfCountDown.subtract(waitTime, 'ms').diff(dayjs(), 's')
					setTimeout(() => {
						if (secondRemaining < 0) {
							if (getDuration() > 0) {
								setEndOfCountDown(dayjs().add(getDuration(), 'ms'))
							} else {
								clearInterval(gameCountDown)
								firebaseRefRoom(location.state.roomCode).once('value', (snap) => {
									if (snap.exists) {
										const room_data = snap.val()
										const numberCurrentTimeline = parseInt(room_data.current_timeline.split('-')[1])
										if (room_data.game_status === 'playing' && roomMasterUID === UID) {
											firebaseRefRoom(location.state.roomCode)
												.update({ game_status: 'game_start_countdown', current_timeline: `game-${numberCurrentTimeline + 1}` })
												.then(() => {
													firebaseRefPlayerOnRoom(location.state.roomCode, UID).once('value', (playerData) => {
														const data = playerData.val()
														firebaseRefPlayerOnRoom(location.state.roomCode, UID)
															.update({
																salah: (data?.salah || 0) + salah,
																benar: (data?.benar || 0) + benar,
																score: (data?.score || 0) + (benar - salah)
															})
															.finally(() => {
																navigate(URLS.ROOM.replace(':id', '') + location.state.roomCode, { state: { gameFrom: 'simplicity' } })
															})
													})
												})
										} else {
											firebaseRefPlayerOnRoom(location.state.roomCode, UID).once('value', (playerData) => {
												const data = playerData.val()
												firebaseRefPlayerOnRoom(location.state.roomCode, UID)
													.update({
														salah: (data?.salah || 0) + salah,
														benar: (data?.benar || 0) + benar,
														score: (data?.score || 0) + (benar - salah)
													})
													.finally(() => {
														navigate(URLS.ROOM.replace(':id', '') + location.state.roomCode, { state: { gameFrom: 'simplicity' } })
													})
											})
										}
									}
								})
							}
						} else {
							setCountDownTime(secondRemaining)
						}
					}, waitTime)
				}, 1000)
			}
		}

		return () => clearInterval(gameCountDown)
	}, [endOfCountDown, gameData, salah, benar])

	const getDuration = () => {
		return endOfCountDown.diff(dayjs(), 'ms')
	}
	// useEffect(() => {
	// 	if (countDownTime < 1) {
	// 		navigate(URLS.ROOM.replace(':id', '') + location.state.roomCode, { state: { gameFrom: 'simplicity' } })
	// 	}
	// }, [countDownTime])
	return (
		<div style={ContainerCenterBasic}>
			{!!countDownTime ? (
				<>
					<Countdown a={countDownTime ?? 0} b={gameplayDuration / 1000 - 1} />
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
				</>
			) : (
				<Loader />
			)}
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

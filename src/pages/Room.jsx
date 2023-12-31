import React, { useEffect, useState } from 'react'
import { Table, Space, Avatar, Modal, Row, Col, Button, Tag, Affix, Select, Typography } from 'antd'
import { CaretRightOutlined, LeftOutlined, StarOutlined } from '@ant-design/icons'
import { firebaseRefPlayerOnRoom, firebaseRefRoom, firebaseTimestamp } from '@/src/firebase-instance/firebaseRef'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from 'react-redux'
import USER_GETTERS from '@/src/store/modules/User/getters'
import Countdown from '@/src/components/Countdown'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import '@/src/styles/hideSelectionColumnTable.css'
import { Store_SetJoinRoom, Store_SetUserLeaveRoom, playerLeaderBoard } from '@/src/firebase-instance/firebaseActions'
import URLS from '../enums/urls'
import { gameplayDuration } from '../config/config'
import { yellow } from '../styles/styles'
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration)
let interval
const modes = [
	{ value: 'two_times', label: '2x', with_number: 2 },
	{ value: 'five_times', label: '5x', with_number: 5 },
	{ value: 'ten_times', label: '10x', with_number: 10 }
]
const totalWaitingDuration = 17
const { Title } = Typography
const Room = () => {
	const [modal, contextHolder] = Modal.useModal()
	const navigate = useNavigate()
	const location = useLocation()
	const store = useStore()
	const state = store.getState()
	const { id } = useParams()
	const [players, setPlayers] = useState([])
	const [roomMasterUID, setRoomMasterUID] = useState('')
	const [gameData, setGameData] = useState({})
	const [loading, setLoading] = useState(true)
	const [mode, setMode] = useState(modes[0].value)
	const [startLoading, setStartLoading] = useState(false)
	const UID = USER_GETTERS.UID(state)
	const USERNAME = USER_GETTERS.username(state)
	const IMAGE_PROFILE = USER_GETTERS.imageProfile(state)
	const [restTime, setRestTime] = useState(0)
	const [endOfCountDown, setEndOfCountDown] = useState(undefined)
	const [countDownTime, setCountDownTime] = useState(undefined)
	const handleLeave = () => {
		Store_SetUserLeaveRoom(UID, roomMasterUID === UID ? 'master' : '', id).finally(() => {
			navigate(URLS.MULTIPLAYER)
		})
	}
	const handleStart = () => {
		setStartLoading(true)
		firebaseRefRoom(id)
			.update({ started_at: firebaseTimestamp, game_status: 'game_start_countdown', mode })
			.then(() => {
				firebaseRefRoom(id)
					.child('started_at')
					.once('value', (snap) => {
						const gameStartAt = dayjs(snap.val())
							.add(totalWaitingDuration * 1000, 'ms')
							.valueOf()
						const timeline = Array.from(Array(modes.find((item) => item.value === mode).with_number).keys()).map((value) => ({
							name: `game-${value + 1}`,
							game_start_at: dayjs(snap.val())
								.add(totalWaitingDuration * 1000 + value * (totalWaitingDuration * 1000 + gameplayDuration), 'ms')
								.valueOf()
						}))
						const timelineObj = timeline.reduce((carry, v) => ({ ...carry, [v.name]: v }), {})
						firebaseRefRoom(id).update({
							game_start_at: gameStartAt,
							timeline: timelineObj,
							current_timeline: 'game-1'
						})
					})
			})
			.finally(() => {
				setStartLoading(false)
			})
	}
	useEffect(() => {
		Store_SetJoinRoom(id, location.state?.gameFrom)
			.then((res) => {
				if (res === 'ok') {
					firebaseRefRoom(id).on('value', (snap) => {
						if (snap.exists()) {
							const { players: resPlayers, room_master, ...other } = snap.val()
							setRoomMasterUID(room_master)
							if (other.current_timeline === 'game-1') {
								firebaseRefPlayerOnRoom(id, UID).update({
									salah: 0,
									benar: 0,
									score: 0
								})
							}
							if (!isEqual(other, gameData)) {
								setGameData(other)
							}
							setPlayers(
								Object.keys(resPlayers || {})
									.map((key) => resPlayers[key])
									.sort((a, b) => (b.user_role === 'master') - (a.user_role === 'master'))
									.sort((a, b) => (b?.score || 0) - (a?.score || 0))
							)
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
						setLoading(false)
					})
				}
			})
			.catch((err) => {
				if (err.statusCode === 404) {
					Modal.info({
						title: 'Info',
						content: (
							<div>
								<p>{err.message}</p>
							</div>
						),
						onOk: () => navigate(URLS.MULTIPLAYER)
					})
				}
			})

		interval = setInterval(() => {
			setRestTime((prev) => (prev += 1))
		}, 1000)
		return () => {
			// on unmount
			firebaseRefRoom(id).off()
		}
	}, [])
	useEffect(() => {
		if (restTime === 60 - 1) {
			clearInterval(interval)
		}
	}, [restTime])
	useEffect(() => {
		var countDown = undefined
		if (!!gameData?.current_timeline) {
			const currentTimelinePosition = Object.keys(gameData.timeline).indexOf(gameData.current_timeline)
			const maxGameTimeline = modes.find((item) => item.value === gameData.mode).with_number
			if (currentTimelinePosition !== -1 && currentTimelinePosition < maxGameTimeline) {
				if (endOfCountDown === undefined) {
					const gameStartAt = dayjs(gameData.timeline[gameData.current_timeline].game_start_at)
					const waitTime = (gameStartAt.diff(dayjs(), 'ms') % 1000) - 1
					setTimeout(() => {
						setEndOfCountDown(gameStartAt.subtract(waitTime, 'ms'))
					}, waitTime)
				} else {
					countDown = setInterval(() => {
						const waitTime = (endOfCountDown.diff(dayjs(), 'ms') % 1000) - 1
						const secondRemaining = endOfCountDown.subtract(waitTime, 'ms').diff(dayjs(), 's')
						setTimeout(() => {
							if (secondRemaining < 1) {
								if (getDuration() > 0) {
									setEndOfCountDown(dayjs().add(getDuration(), 'ms'))
								} else {
									clearInterval(countDown)
									if (UID === roomMasterUID) {
										firebaseRefRoom(id).update({ game_status: 'playing' })
									}
									navigate(URLS.SIMPLICITY, { state: { roomCode: id } })
								}
							} else {
								setCountDownTime(secondRemaining)
							}
						}, waitTime)
					}, 1000)
				}
			} else {
				modal.info({
					title: null,
					icon: null,
					content: (
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column'
							}}>
							<Title level={4} style={{ color: yellow }}>{`${
								(players || [{ username: '' }])[0].username
							} Sang Pemenang!`}</Title>
							<Avatar
								size={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100, xxl: 100 }}
								src={(players || [{ imageProfile: '' }])[0].imageProfile}
							/>
						</div>
					)
				})
				if (UID === roomMasterUID) {
					firebaseRefRoom(id).update({ game_status: 'waiting', current_timeline: '' })
				}
				const myRankPosition = players.findIndex((x) => x.uid === UID)

				if ('mode' in gameData) {
					playerLeaderBoard(gameData.mode, UID).once('value', (snap) => {
						if (snap.exists()) {
							const { jumlah_bermain, jumlah_menang } = snap.val()
							playerLeaderBoard(gameData.mode, UID).update({
								jumlah_bermain: jumlah_bermain + 1,
								username: USERNAME,
								imageProfile: IMAGE_PROFILE,
								...(myRankPosition === 0 ? { jumlah_menang: jumlah_menang + 1 } : {})
							})
						} else {
							playerLeaderBoard(gameData.mode, UID).update({
								jumlah_bermain: 1,
								username: USERNAME,
								imageProfile: IMAGE_PROFILE,
								...(myRankPosition === 0 ? { jumlah_menang: 1 } : {jumlah_menang: 0})
							})
						}
					})
				}
			}
		}
		return () => clearInterval(countDown)
	}, [endOfCountDown, gameData])
	const getDuration = () => {
		return dayjs(gameData.timeline[gameData.current_timeline].game_start_at).diff(dayjs(), 'ms')
	}
	return (
		<div>
			<Affix offsetTop={10}>
				<div style={{ display: 'flex', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.6)' }}>
					<Button icon={<LeftOutlined />} onClick={handleLeave}>
						Leave
					</Button>
					<div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
						{UID === roomMasterUID &&
							!gameData?.current_timeline &&
							!(gameData.game_status === 'game_start_countdown' && countDownTime > 0) && (
								<Space>
									<Select
										value={mode}
										onChange={setMode}
										placeholder="modes"
										options={[
											{ value: 'two_times', label: '2x' },
											{ value: 'five_times', label: '5x' },
											{ value: 'ten_times', label: '10x' }
										]}
									/>
									<Button icon={<CaretRightOutlined />} onClick={handleStart} loading={startLoading}>
										Start
									</Button>
								</Space>
							)}
						{gameData.game_status === 'game_start_countdown' && countDownTime > 0 && (
							<Countdown onRest={true} a={countDownTime || 0} b={totalWaitingDuration - 1} />
						)}
					</div>
				</div>
			</Affix>
			<Table
				rowKey="uid"
				loading={loading}
				columns={[
					{ dataIndex: 'no', title: '#', width: 80, render: (value, rowValues, index) => index + 1 },
					{
						dataIndex: 'username',
						title: 'Pemain',
						render: (value, rowValues, index) => (
							<Space>
								<Avatar src={rowValues.imageProfile} />
								{rowValues.user_role === 'master' ? (
									<>
										<Tag bordered={false} color="warning">
											<StarOutlined />
										</Tag>
										{value}
									</>
								) : (
									value
								)}
							</Space>
						)
					},
					{
						dataIndex: 'score',
						title: 'Score'
					}
				]}
				dataSource={players}
				bordered
				title={() => (
					<Row>
						<Col span={16}>Room : {gameData.roomcode}</Col>
					</Row>
				)}
				scroll={{ x: 'max-content' }}
				pagination={false}
				rowSelection={{
					renderCell: () => null,
					selectedRowKeys: [UID]
				}}
			/>
			{contextHolder}
		</div>
	)
}
export default Room

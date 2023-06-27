import React, { useEffect, useState } from 'react'
import { Table, Space, Avatar, Modal, Row, Col, Button, Tag, Affix } from 'antd'
import { CaretRightOutlined, LeftOutlined, StarOutlined } from '@ant-design/icons'
import { firebaseRefRoom, firebaseTimestamp } from '@/src/firebase-instance/firebaseRef'
import { useParams } from 'react-router-dom'
import { useStore } from 'react-redux'
import USER_GETTERS from '@/src/store/modules/User/getters'
import Countdown from '@/src/components/Countdown'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import '@/src/styles/hideSelectionColumnTable.css'
import navigateTo from '@/src/utils/navigateTo'
import { Store_SetJoinRoom, Store_SetUserLeaveRoom } from '@/src/firebase-instance/firebaseActions'
import URLS from '../enums/urls'
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration)
let interval
const Room = () => {
	const totalWaitingDuration = 12
	const { id } = useParams()
	const [players, setPlayers] = useState([])
	const [roomMasterUID, setRoomMasterUID] = useState('')
	const [gameData, setGameData] = useState({})
	const [loading, setLoading] = useState(true)
	const store = useStore()
	const state = store.getState()
	const UID = USER_GETTERS.UID(state)
	const [restTime, setRestTime] = useState(0)
	const [endOfCoolDown, setEndOfCoolDown] = useState(undefined)
	const [coolDownTime, setCoolDownTime] = useState(undefined)
	const handleLeave = () => {
		Store_SetUserLeaveRoom(UID, roomMasterUID === UID ? 'master' : '', id).finally(() => {
			navigateTo(URLS.MULTIPLAYER)
		})
	}
	const handleStart = () => {
		firebaseRefRoom(id)
			.update({ playing: 'true', started_at: firebaseTimestamp })
			.then(() => {
				firebaseRefRoom(id)
					.child('started_at')
					.once('value', (snap) => {
						const gameStartAt = dayjs(snap.val()).add(12000, 'ms').valueOf()
						firebaseRefRoom(id).child('game_start_at').set(gameStartAt)
					})
			})
	}
	useEffect(() => {
		Store_SetJoinRoom(id)
			.then((res) => {
				if (res === 'ok') {
					firebaseRefRoom(id).on('value', (snap) => {
						if (snap.exists()) {
							const { player, room_master, ...other } = snap.val()
							setRoomMasterUID(room_master)
							if (!isEqual(other, gameData)) {
								setGameData(other)
							}
							setPlayers(
								Object.keys(player || {})
									.map((key) => player[key])
									.sort((a, b) => (b.user_role === 'master') - (a.user_role === 'master'))
							)
						} else {
							Modal.info({
								title: 'Room tidak ditemukan!',
								content: (
									<div>
										<p>Room tidak ditemukan!</p>
									</div>
								),
								onOk: () => navigateTo(URLS.MULTIPLAYER)
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
						onOk: () => navigateTo(URLS.MULTIPLAYER)
					})
				}
			})

		interval = setInterval(() => {
			setRestTime((prev) => (prev += 1))
		}, 1000)
		return () => {
			// on unmount
			console.log('unmount room', id)

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
		if (gameData.playing === 'true' && gameData?.game_start_at !== undefined) {
			if (endOfCoolDown === undefined) {
				const gameStartAt = dayjs(gameData.game_start_at)
				const waitTime = (gameStartAt.diff(dayjs(), 'ms') % 1000) - 1
				setTimeout(() => {
					setEndOfCoolDown(gameStartAt.subtract(waitTime, 'ms'))
				}, waitTime)
			} else {
				countDown = setInterval(() => {
					const secondRemaining = endOfCoolDown.diff(dayjs(), 's')
					if (secondRemaining < 0) {
						if (getDuration() > 0) {
							setEndOfCoolDown(dayjs().add(getDuration(), 'ms'))
						} else {
							clearInterval(countDown)
						}
					} else {
						setCoolDownTime(secondRemaining)
					}
				}, 1000)
			}
		}

		return () => clearInterval(countDown)
	}, [endOfCoolDown, gameData])
	const getDuration = () => {
		return dayjs(gameData.game_start_at).diff(dayjs(), 'ms')
	}
	return (
		<div>
			<Affix offsetTop={10}>
				<div style={{ display: 'flex', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.6)' }}>
					<Button icon={<LeftOutlined />} onClick={handleLeave}>
						Leave
					</Button>
					<div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
						{UID === roomMasterUID && !(gameData.playing === 'true' && coolDownTime > 0) && (
							<Button icon={<CaretRightOutlined />} onClick={handleStart}>
								Start
							</Button>
						)}
						{gameData.playing === 'true' && coolDownTime > 0 && (
							<Countdown onRest={true} a={coolDownTime || 0} b={totalWaitingDuration - 1} />
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
								{rowValues.uid === roomMasterUID ? (
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
		</div>
	)
}
export default Room

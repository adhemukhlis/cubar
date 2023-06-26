import React, { useEffect, useState } from 'react'
import { Table, Space, Avatar, Modal, Row, Col, Button, Tag } from 'antd'
import { CaretRightOutlined, StarOutlined } from '@ant-design/icons'
import { firebaseRefRoom, firebaseTimestamp } from '@/src/firebase-instance/firebaseRef'
import { useParams } from 'react-router-dom'
import { useStore } from 'react-redux'
import USER_GETTERS from '@/src/store/modules/User/getters'
import Countdown from '@/src/components/Countdown'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import '@/src/styles/hideSelectionColumnTable.css'
import navigateTo from '@/src/utils/navigateTo'
import { Store_SetUserLeaveRoom } from '@/src/firebase-instance/firebaseActions'
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
		firebaseRefRoom(id).on('value', (snap) => {
			if (snap.exists()) {
				const { player, room_master, ...other } = snap.val()
				setRoomMasterUID(room_master)
				if (!isEqual(other, gameData)) {
					setGameData(other)
				}
				setPlayers(Object.keys(player || {}).map((key) => player[key]))
			} else {
				Modal.info({
					title: 'Room tidak ditemukan!',
					content: (
						<div>
							<p>Room tidak ditemukan!</p>
						</div>
					),
					onOk: () => navigateTo('/menu')
				})
			}
			setLoading(false)
		})

		interval = setInterval(() => {
			setRestTime((prev) => (prev += 1))
		}, 1000)
		return () => {
			// on unmount
			console.log('unmount room', id)
			Store_SetUserLeaveRoom(UID, roomMasterUID === UID ? 'master' : '', id)
			firebaseRefRoom(id)
				.update({ playing: 'false' })
				.then(() => {
					firebaseRefRoom(id).off()
				})
		}
	}, [])
	useEffect(() => {
		if (restTime === 60 - 1) {
			clearInterval(interval)
		}
	}, [restTime])
	useEffect(() => {
		var tradeCoolDown = undefined
		if (gameData.playing === 'true' && gameData?.game_start_at !== undefined) {
			if (endOfCoolDown === undefined) {
				const gameStartAt = dayjs(gameData.game_start_at)
				const waitTime = (gameStartAt.diff(dayjs(), 'ms') % 1000) - 1
				setTimeout(() => {
					setEndOfCoolDown(gameStartAt.subtract(waitTime, 'ms'))
				}, waitTime)
			} else {
				tradeCoolDown = setInterval(() => {
					const secondRemaining = endOfCoolDown.diff(dayjs(), 's')
					if (secondRemaining < 0) {
						if (getDuration() > 0) {
							setEndOfCoolDown(dayjs().add(getDuration(), 'ms'))
						} else {
							clearInterval(tradeCoolDown)
						}
					} else {
						setCoolDownTime(secondRemaining)
					}
				}, 1000)
			}
		}

		return () => clearInterval(tradeCoolDown)
	}, [endOfCoolDown, gameData])
	const getDuration = () => {
		return dayjs(gameData.game_start_at).diff(dayjs(), 'ms')
	}
	return (
		<div>
			{roomMasterUID}
			<div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>{gameData.playing === 'true' && coolDownTime > 0 && <Countdown onRest={true} a={coolDownTime || 0} b={totalWaitingDuration-2} />}</div>
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
						<Col span={8}>
							{
							 UID	=== roomMasterUID && <Button block icon={<CaretRightOutlined />} onClick={handleStart}>
								Start
							</Button>
							}
							
						</Col>
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

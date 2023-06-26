import React, { useEffect, useState } from 'react'
import { Table, Space, Avatar, Modal, Row, Col, Button, PageHeader } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import { firebaseRefRoom, firebaseTimestamp } from 'root/src/firebaseRef/firebaseRef'
import { useParams, useHistory } from 'react-router-dom'
import { useStore } from 'react-redux'
import 'root/src/styles/hideSelectionColumnTable.css'
import USER_GETTERS from 'root/src/store/modules/User/getters'
import Countdown from 'src/game/component/countdown'
import moment from 'moment'
import { isEqual } from 'lodash'
import navigateTo from 'root/src/utils/navigateTo'
let interval
const Room = () => {
	const totalWaitingDuration = 12
	const { id } = useParams()
	const history = useHistory()
	const [players, setPlayers] = useState([])
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
						const gameStartAt = moment(snap.val()).add(12000, 'ms').valueOf()
						firebaseRefRoom(id).child('game_start_at').set(gameStartAt)
						console.log('set start game')
					})
			})
	}
	useEffect(() => {
		firebaseRefRoom(id).on('value', (snap) => {
			if (snap.exists()) {
				const { player, ...other } = snap.val()
				if (!isEqual(other, gameData)) {
					setGameData(other)
				}
				setPlayers(Object.keys(player).map((key) => player[key]))
			} else {
				Modal.info({
					title: 'Room tidak ditemukan!',
					content: (
						<div>
							<p>Room tidak ditemukan!</p>
						</div>
					),
					onOk: () => history.push('/menu')
				})
			}
			setLoading(false)
		})

		interval = setInterval(() => {
			setRestTime((prev) => (prev += 1))
		}, 1000)
		return () => {
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
				const gameStartAt = moment(gameData.game_start_at)
				console.log(gameStartAt.diff(moment(), 'ms'))
				const waitTime = (gameStartAt.diff(moment(), 'ms') % 1000) - 1
				setTimeout(() => {
					setEndOfCoolDown(gameStartAt.subtract(waitTime, 'ms'))
				}, waitTime)
			} else {
				tradeCoolDown = setInterval(() => {
					const secondRemaining = endOfCoolDown.diff(moment(),'s')
					if (secondRemaining < 0) {
						if (getDuration() > 0) {
							setEndOfCoolDown(moment().add(getDuration(), 'ms'))
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
		return moment(gameData.game_start_at).diff(moment(), 'ms')
	}
	return (
		<div>
			<PageHeader
    onBack={() => navigateTo('/menu')}
    title="Room"
  />
			<div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
				{
					gameData.playing === 'true' && coolDownTime>0 && <Countdown onRest={true} a={coolDownTime||0} b={totalWaitingDuration} />
				}
				
			</div>
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
								{value}
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
							<Button block icon={<CaretRightOutlined />} onClick={handleStart}>
								Start
							</Button>
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

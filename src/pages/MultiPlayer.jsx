import React, { useState, useEffect, Fragment } from 'react'
import { Store_SetUserJoinRoom, Store_SetUserCreateRoom } from '@/src/firebase-instance/firebaseActions'
import { Col, Row, Input, Form, Divider, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Loader from '@/src/components/Loader'

const { Item } = Form
const MultiPlayer = () => {
	const [roomCode, setRoomCode] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [status, setStatus] = useState(null)
	const handleRoomCode = (e) => setRoomCode(e.target.value)
	const handleSearchRoom = (value) => {
		setStatus(null)
		Store_SetUserJoinRoom(value)
			.then((res) => {
				console.log(res)
			})
			.catch(({ statusCode, message }) => {
				setStatus({ statusCode, message })
			})
	}
	const createRoom = () => {
		Store_SetUserCreateRoom()
	}
	const roomcodeInputValidator = (_, value) => {
		if (value.length > 0) {
			return Promise.resolve()
		}
		return Promise.reject(new Error('isi Roomcode'))
	}
	useEffect(() => {
		console.log('multiplayer useEffect')
		setIsLoading(false)
	}, [])
	return isLoading ? (
		<Loader style={{ minHeight: '100vh' }} />
	) : (
		<Fragment>
			<div
				style={{
					backgroundColor: '#fafafa',
					padding: '2rem',
					minHeight: '100vh'
				}}>
				<Row style={{ marginBottom: '2rem', gap: '10' }} justify="center">
					<Col {...{ xs: 24, sm: 4, md: 4, lg: 4 }}>
						<Form>
							<Item
								name="roomcode"
								rules={[
									{
										validator: roomcodeInputValidator
									}
								]}
								{...(status !== null && [404].includes(status.statusCode) ? { validateStatus: [404].includes(status.statusCode) ? 'error' : '', help: status.message } : {})}>
								<Input.Search size="large" placeholder="Cari Room dengan Roomcode" allowClear value={roomCode} onChange={handleRoomCode} onSearch={handleSearchRoom} />
							</Item>
						</Form>
					</Col>
					<Col span={24}>
						<Divider>Atau</Divider>
					</Col>
					<Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
						<Button icon={<PlusOutlined />} onClick={createRoom}>
							Buat Room
						</Button>
					</Col>
				</Row>
			</div>
		</Fragment>
	)
}
export default MultiPlayer

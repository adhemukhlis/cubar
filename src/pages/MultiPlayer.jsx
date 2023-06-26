import React, { useState, useEffect, Fragment } from 'react'
import { ContainerCenterBasic, IconBlack } from '../config/styles'
import NavBar from '../component/navbar'
import { IcRegularSwords } from '../icons/react-icon-svg'
import { Store_SetUserJoinRoom, Store_SetUserCreateRoom } from 'root/src/game/store/firebaseActions'
import { Col, Row, Input, PageHeader, Space, Form, Divider, Button } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Loader from 'src/game/component/loader'

const { Item } = Form
const MultiPlayer = () => {
	const [data, setData] = useState({
		disabled: false,
		resttime: 0,
		gameselect: null,
		playerCount: 5,
		logged: false,
		level: 5,
		roomcode: ''
	})
	const [isLoading, setIsLoading] = useState(true)
	const [status, setStatus] = useState(null)
	const handleRoomCode = (e) => setData((prev) => ({ ...prev, roomcode: e.target.value }))
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
	const joinRoom = () => {
		Store_SetUserJoinRoom(data.roomcode)
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
			<PageHeader
				onBack={() => window.history.back()}
				title={
					<Space>
						<IcRegularSwords fill={IconBlack} height="1.2rem" />
						Multiplayer
					</Space>
				}
			/>
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
								<Input.Search size="large" placeholder="Cari Room dengan Roomcode" allowClear value={data.roomcode} onChange={handleRoomCode} onSearch={handleSearchRoom} />
							</Item>
						</Form>

						{/* <Icon name="search" />
						<input />
						<Button onClick={joinRoom} color="teal">
							Cari
						</Button> */}
					</Col>
					<Col span={24}>
						<Divider>Atau</Divider>
					</Col>
					<Col span={24} style={{display:'flex', justifyContent:'center'}}>
						<Button icon={<PlusOutlined />} onClick={createRoom}>Buat Room</Button>
					</Col>
					{/* <Segment basic textAlign="center"> */}
					{/* <Input
						value={data.roomcode}
						onChange={handleRoomCode}
						action
						type="text"
						iconPosition="left"
						placeholder="roomcode"
					>
						<Icon name="search" />
						<input />
						<Button onClick={joinRoom} color="teal">
							Cari
						</Button>
					</Input> */}
					{/* <Divider horizontal>Or</Divider> */}
					{/* <Button onClick={createRoom} color="teal" content="Buat room" icon="add" labelPosition="left" /> */}
					{/* </Segment> */}
				</Row>
				{/* <NavBar as="navpage" head="Main Bareng">
					<IcRegularSwords fill={IconBlack} height="4vh" />
				</NavBar> */}
			</div>
		</Fragment>
	)
}
export default MultiPlayer

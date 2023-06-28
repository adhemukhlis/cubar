import React, { Fragment, useEffect, useState } from 'react'
import { orderBy } from 'lodash'
import { firebaseListLeaderboardByInstansi } from '@/src/firebase-instance/firebaseActions'
import { Space, Table, Tag, Avatar, Typography, Select, Row, Col, Card, Affix, Button } from 'antd'
import Loader from '@/src/components/Loader'
import { firebaseRefLeaderBoard, firebaseRefListInstansi } from '@/src/firebase-instance/firebaseRef'
import { LeftOutlined } from '@ant-design/icons'
const { Text } = Typography
const Leaderboard = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [leaderboardFilter, setLeaderboardFilter] = useState('sdn-4-kalibagor')
	const [listInstansi, setListInstansi] = useState([])
	const [listLeaderboard, setListLeaderboard] = useState([])

	useEffect(() => {
		firebaseRefListInstansi.once('value', (snap) => {
			const data = snap.val()
			const listData = Object.keys(data).map((key) => {
				return { key, ...data[key] }
			})
			setListInstansi(listData)
		})

		return () => {
			firebaseRefListInstansi.off()
			firebaseListLeaderboardByInstansi(leaderboardFilter).off()
		}
	}, [])
	useEffect(() => {
		// firebaseListLeaderboardByInstansi(leaderboardFilter, (data) => {
		// 	setListLeaderboard(data.map(({ nama, skor }) => ({ nama, skor })))
		// 	setIsLoading(false)
		// })
		firebaseListLeaderboardByInstansi(leaderboardFilter).on('value', (snap) => {
			const data = snap.val()
			const listData = Object.keys(data).map((key) => {
				const { nama, skor } = data[key]
				return { id: key, nama, skor }
			})
			setListLeaderboard(listData)
			setIsLoading(false)
		})
	}, [leaderboardFilter])

	const listInstansiOptions = listInstansi.map((data, i) => ({ key: i, label: data.name, value: data.key }))
	const orderedUser = orderBy(listLeaderboard, ['skor', 'skor'], ['asc', 'desc'])
	const columns = [
		{
			title: '#',
			dataIndex: 'number',
			key: 'number',
			render: (text) =>
				text <= 3 ? (
					<Tag color={['processing', 'warning', 'default'].at(text - 1)}>
						<b>{text}</b>
					</Tag>
				) : (
					<b>{text}</b>
				)
		},
		{
			title: 'Player',
			dataIndex: 'player',
			key: 'player',
			render: (value, obj) => {
				return (
					<Space>
						<Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} src={obj.imageUrl} />
						<Text strong>{obj.nama}</Text>
					</Space>
				)
			}
		},
		{
			title: 'Performance',
			dataIndex: 'skor',
			key: 'skor'
		}
	]
	const onFilterBoardChange = (value) => {
		setIsLoading(true)
		setLeaderboardFilter((prev) => {
			firebaseRefLeaderBoard.child(prev).off()
			return value
		})
	}

	const onFilterBoardSearch = (value) => {
		// setLeaderboardState((prev) => ({ ...prev, leaderboardFilter: value }))
	}
	return isLoading ? (
		<div style={{ minHeight: '100vh' }}>
			<Loader />
		</div>
	) : (
		<Fragment>
			<div
				style={{
					backgroundColor: '#fafafa',
					padding: '2rem',
					minHeight: '100vh'
				}}>
				<Affix offsetTop={10}>
					<div style={{ display: 'flex', padding: '1rem 0 1rem 0' }}>
						<Button icon={<LeftOutlined />} onClick={() => window.history.back()}>
							Back
						</Button>
					</div>
				</Affix>
				<Row style={{ marginBottom: '2rem', gap: '10' }}>
					<Col {...{ xs: 24, sm: 4, md: 4, lg: 4, lg: 4 }}>
						<Select
							style={{ width: '100%' }}
							size="large"
							showSearch
							value={leaderboardFilter}
							placeholder="Select a person"
							optionFilterProp="children"
							onChange={onFilterBoardChange}
							onSearch={onFilterBoardSearch}
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={listInstansiOptions}
						/>
					</Col>
				</Row>
				<Card>
					<Table
						columns={columns}
						rowKey="number"
						scroll={{ x: 'max-content' }}
						dataSource={orderedUser.map(({ nama, skor }, n) => ({ number: n + 1, nama, skor, imageUrl: '' }))}
						pagination={{ responsive: true }}
					/>
				</Card>
			</div>
		</Fragment>
	)
}
export default Leaderboard

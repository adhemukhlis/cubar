import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />
const Loader = () => {
	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
			<Spin indicator={antIcon} />
		</div>
	)
}
export default Loader

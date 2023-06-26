import React from 'react'

import { Drawer, Button, Space, Divider } from 'antd'
import { LogoutOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import AUTH_ACTIONS from '@/src/store/modules/Auth/actions'
import ACTION_TYPES from '@/src/store/types/action-types'
const DrawerMenu = (props) => {
	const dispatch = useDispatch()
	const authLogout = () => dispatch(AUTH_ACTIONS[ACTION_TYPES.AUTH_LOGOUT]())


	const logoutHandler = () => {
		authLogout()
	}
	return (
		<Drawer {...props} closable>
			<Space direction="vertical" style={{ width: '100%' }}>
				{/* <Button block icon={<UserOutlined />} onClick={() => history.push(getState('_globalUtoken') !== 'guest' ? PATH.account : PATH.menu)}>
					Akun
				</Button> */}
				
				<Divider dashed />
				<Button block onClick={logoutHandler} icon={<LogoutOutlined />} danger>
					Logout
				</Button>
			</Space>
		</Drawer>
	)
}
export default DrawerMenu

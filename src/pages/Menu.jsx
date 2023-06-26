import React, { useState } from 'react'

import { ProfileContainer, GridContainer, UsernameMenuText } from '@/src/styles/styles'
import URLS from '@/src/enums/urls'
import { IcRegularSwords } from '@/src/styles/react-icon-svg'
import ControlMenu from '@/src/components/ControlMenu'
import DrawerMenu from '@/src/components/DrawerMenu'
import { Avatar, Button, Drawer } from 'antd'
import { useStore } from 'react-redux'
import USER_GETTERS from '@/src/store/modules/User/getters'
import { MoreOutlined } from '@ant-design/icons'

const Menu = () => {
	const store = useStore()
	const state = store.getState()
	const username = USER_GETTERS.username(state)
	const imageProfile = USER_GETTERS.imageProfile(state)
	const [drawerVisible, setDrawerVisible] = useState(false)

	const showDrawer = () => {
		setDrawerVisible(true)
	}
	const onClose = () => {
		setDrawerVisible(false)
	}
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column'
			}}>
			<div style={ProfileContainer}>
				<Button style={{ position: 'absolute', top: '4vw', right: '4vw' }}>
					Logout
				</Button>

				<Avatar size={{ xs: 128, sm: 160, md: 256, lg: 320, xl: 400, xxl: 480 }} src={imageProfile} />
				<span style={UsernameMenuText}>{username}</span>
			</div>
			<div style={GridContainer}>
				<ControlMenu text="Main Bareng" to={URLS.MULTIPLAYER}>
					<IcRegularSwords fill="rgba(0, 0, 0, 0.6)" height="10vw" />
				</ControlMenu>
				{/* <ControlMenu
          text="Main Sendiri"
          to={getState("_globalUtoken") === "guest" ? "/#" : PATH.singleplayer}
        >
          <IcRegularSword fill="rgba(0, 0, 0, 0.6)" height="10vw" />
        </ControlMenu> */}
				{/* <ControlMenu text="Latihan" to={PATH.training}>
					<IcRegularCrosshairs fill="rgba(0, 0, 0, 0.6)" height="10vw" />
				</ControlMenu> */}
				{/* <ControlMenu text="Leaderboard" to={PRIVATE_ROUTE.LEADERBOARD}>
					<IcRegularCrown fill="rgba(0, 0, 0, 0.6)" height="10vw" />
				</ControlMenu> */}
			</div>
			{/* <DrawerMenu title="Menu" placement="bottom" closable={false} onClose={onClose} open={true} /> */}
		</div>
	)
}
export default Menu

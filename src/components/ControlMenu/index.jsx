import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { GridItem } from '@/src/styles/styles'
import Button3d from '../3d-button/3d-button'
class ControlMenu extends Component {
	render() {
		const { to, text, onClick, children } = this.props
		return (
			<Link to={to}>
				<Button3d onClick={onClick} style={GridItem}>
					{children}
					{text}
				</Button3d>
			</Link>
		)
	}
}
export default ControlMenu

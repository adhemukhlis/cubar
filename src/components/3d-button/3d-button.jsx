import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import './3d-button.css'
const Button3d = ({ loading, children, ...props }) => (
	<div id="button3d" {...props}>
		{children}
		{!!loading && <LoadingOutlined style={{ marginLeft: '0.6em' }} />}
	</div>
)
export default Button3d

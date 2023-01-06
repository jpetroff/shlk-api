import styles from './Header.less'
import React from 'react'

import { Logo, LogoC } from '../../components/icons'

import constants from '../../js/constants'

type Props = {}

type State = {}

export class Header extends React.Component<Props, State> {
	private isMobile: boolean

	constructor(props) {
		super(props)
		this.isMobile = Modernizr.mq(constants.MediaQueries.mobile)
	}

	render() {
		return (
			<div className={`${styles.wrapperClass} app-header`}>
				<Logo className={`app-header__logo app-header__logo_d`} />
				<LogoC className={`app-header__logo app-header__logo_m`} />
			</div>
		)
	}
}
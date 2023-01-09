import styles from './Header.less'
import * as React from 'react'

import { Logo, LogoC } from '../../components/icons'

import constants from '../../js/constants'
import { checkMobileMQ } from '../../js/utils'

type Props = {}

type State = {}

export default class Header extends React.Component<Props, State> {
	private isMobile: boolean

	constructor(props) {
		super(props)
		this.isMobile = checkMobileMQ()
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
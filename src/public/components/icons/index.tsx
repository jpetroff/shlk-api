import styles from './icons.less'
import * as React from 'react'

import LogoSvg from '../../assets/svg/logo.svg'
import LogoCSvg from '../../assets/svg/logo-compact.svg'
import AvatarSvg from '../../assets/svg/icon/avatar.svg'
import CaretRightSvg from '../../assets/svg/icon/caret-right.svg'
import CrossSvg from '../../assets/svg/icon/cross.svg'
import CrossSvg_16 from '../../assets/svg/icon/cross_16.svg'
import EnterSvg from '../../assets/svg/icon/enter.svg'


export const Logo = LogoSvg
export const LogoC = LogoCSvg
export const Avatar = AvatarSvg
export const CaretRight = CaretRightSvg
export const Cross = CrossSvg
export const Enter = EnterSvg
export const Cross_16 = CrossSvg_16

export enum IconSize {
	SMALL = 'small',
	LARGE = 'large'
}

export type ReactIcon = React.FunctionComponent<React.SVGAttributes<SVGElement>>

type Props = {
	useIcon: ReactIcon
	size: IconSize
} & JSX.IntrinsicElements["div"]

const Icon : React.FC<Props> = function( {
	useIcon,
	size
} ) {
	const globalClass = 'icon-svg'
	const IconNode = useIcon
	return (
		<div className={`${styles.wrapperClass} ${globalClass} ${globalClass}_size-${size}`}>
			<IconNode className={`${globalClass}__node`} />
		</div>
	)
}

export default Icon
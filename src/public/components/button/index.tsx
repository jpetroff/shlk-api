import styles from './button.less'
import React from 'react'
import _ from 'underscore'

import Icon, { ReactIcon, IconSize, CaretRight } from '../icons'

export enum ButtonSize {
	LARGE = 'large',
	SMALL = 'small'
}

export enum ButtonType {
	PRIMARY = 'primary',
	GHOST = 'ghost',
	SECONDARY = 'secondary',
	GHOST_PRIMARY = 'ghost_primary'
}

type Props = {
	label?: string
	icon?: ReactIcon
	size: ButtonSize
	type: ButtonType
	onClick?: React.ReactEventHandler<HTMLAnchorElement>
	isDisabled?: boolean,
	isCaret?: boolean
} & JSX.IntrinsicElements["a"]

const BtnIcnMap = _.object(
	[ButtonSize.LARGE,	ButtonSize.SMALL,	],
	[IconSize.LARGE,		IconSize.SMALL,		]
)

const Button : React.FC<Props> = function(
	args : Props
) {
	const globalClass = 'button'

	let buttonClassMods : Array<string> = []
	buttonClassMods.push(globalClass + '_' + args.size)
	buttonClassMods.push(globalClass + '_' + args.type)
	if(args.isDisabled) buttonClassMods.push(globalClass+'_disabled')
	if(!args.label && args.icon) buttonClassMods.push(globalClass+'_icon-only')

	const htmlAnchorProps = _.omit(args, 'size', 'type', 'isDisabled', 'isCaret', 'label', 'icon')

	return (
		<a {...htmlAnchorProps} 
			className={`${args.className} ${globalClass} ${buttonClassMods.join(' ')} ${styles.wrapperClass}`}>
				{args.icon && 
					<Icon 
						className={`${globalClass}__icon`}
						useIcon={args.icon} 
						size={BtnIcnMap[args.size] || IconSize.SMALL} />
				}
				{args.label && 
					<span 
						className={`${globalClass}__label`} >
						{args.label}
					</span>
				}
				{args.isCaret &&
					<Icon useIcon={CaretRight} size={IconSize.SMALL}/>
				}
		</a>
	)
}

export default Button
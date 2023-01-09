import styles from './button.less'
import * as React from 'react'
import * as _ from 'underscore'

import Icon, { ReactIcon, IconSize, CaretRight } from '../icons'

export enum ButtonSize {
	LARGE = 'large',
	SMALL = 'small'
}

export enum ButtonType {
	PRIMARY = 'primary',
	GHOST = 'ghost',
	SECONDARY = 'secondary'
}

type Props = {
	label?: string
	icon?: ReactIcon
	size: ButtonSize
	type: ButtonType
	onClick?: React.ReactEventHandler<HTMLAnchorElement>
	isDisabled?: boolean,
	isLoading?: boolean
	isCaret?: boolean
} & JSX.IntrinsicElements["a"]

const BtnIcnMap = _.object(
	[ButtonSize.LARGE,	ButtonSize.SMALL,	],
	[IconSize.LARGE,		IconSize.SMALL,		]
)

const Button : React.FC<Props> = function(
	args : Props
) {
	const globalClass = styles.wrapperClass+'_button'

	let buttonClassMods : Array<string> = []
	buttonClassMods.push(globalClass + '_' + args.size)
	buttonClassMods.push(globalClass + '_' + args.type)
	if(args.isDisabled || args.isLoading) buttonClassMods.push(globalClass+'_disabled')
	if(args.isLoading) buttonClassMods.push(globalClass+'_loading')
	if(!args.label && args.icon) buttonClassMods.push(globalClass+'_icon-only')

	const htmlAnchorProps = _.omit(args, 'size', 'type', 'isDisabled', 'isCaret', 'label', 'icon', 'isLoading')

	return (
		<a {...htmlAnchorProps} 
			className={`${args.className || ''} ${globalClass} ${buttonClassMods.join(' ')}`}>
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
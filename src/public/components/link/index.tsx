import styles from './link.less'
import React from 'react'
import _ from 'underscore'
import Icon, { ReactIcon, IconSize } from '../icons'

export enum LinkColors {
	USER = 'user',
	APP = 'app'
}

type Props = {
	colorScheme?: LinkColors
	label: string
	icon?: ReactIcon
	iconSize?: IconSize
	iconRight?: boolean
	isDisabled?: boolean
	parentHover?: boolean
	isLoading?: boolean
} & JSX.IntrinsicElements['a']

const Link : React.FC<Props> = (
 _args: Props
) => {
	const args = _.clone(_args)
	_.defaults(args, {
		isDisabled: false,
		isLoading: false, 
		colorScheme: LinkColors.APP
	})

	if(_.isEmpty(args.label)) return (<></>)

	const globalClass = 'link'
	let linkMods : Array<string> = []
	linkMods.push(globalClass+'_'+args.colorScheme)
	if(args.isLoading) linkMods.push(globalClass+'_loading')
	if(args.isDisabled || args.isLoading) linkMods.push(globalClass+'_disabled')
	if(args.parentHover) linkMods.push(globalClass+'_parent-hover')

	const htmlAnchorAttributes = _.omit(args, 'colorScheme', 'label', 'icon', 'iconSize', 'isDisabled', 'iconRight', 'isLoading', 'parentHover')
	return (
		<a {...htmlAnchorAttributes}
			className={`${styles.wrapperClass} ${globalClass} ${linkMods.join(' ')} ${args.className}`}
		>
			{args.icon && !args.iconRight && 
				<Icon useIcon={args.icon} size={args.iconSize || IconSize.SMALL} />
			}

			{args.label}

			{args.icon && args.iconRight && 
				<Icon useIcon={args.icon} size={args.iconSize || IconSize.SMALL} />
			}
		</a>
	)
}

export default Link
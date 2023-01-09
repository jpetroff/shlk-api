import styles from './link.less'
import * as React from 'react'
import * as _ from 'underscore'
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
	isLoading?: boolean
} & JSX.IntrinsicElements['a']

const Link : React.FC<Props> = (
 args: Props
) => {
	if(_.isEmpty(args.label)) return (<></>)

	const globalClass = styles.wrapperClass+'_link'
	let linkMods : Array<string> = []
	linkMods.push(globalClass+'_'+args.colorScheme)
	if(args.isLoading) linkMods.push(globalClass+'_loading')
	if(args.isDisabled || args.isLoading) linkMods.push(globalClass+'_disabled')

	const htmlAnchorAttributes = _.omit(args, 'colorScheme', 'label', 'icon', 'iconSize', 'isDisabled', 'iconRight', 'isLoading')
	return (
		<a {...htmlAnchorAttributes}
			className={`${globalClass} ${linkMods.join(' ')} ${args.className || ''}`}
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

Link.defaultProps = {
	isDisabled: false,
	isLoading: false, 
	colorScheme: LinkColors.APP
}

export default Link
import styles from './link.less'
import * as React from 'react'
import * as _ from 'underscore'
import Icon, { ReactIcon, IconSize } from '../icons'
import classNames from 'classnames'

export enum LinkColors {
	USER = 'user',
	APP = 'app'
}

type Props = {
	colorScheme?: LinkColors
	label?: string
	icon?: ReactIcon
	iconSize?: IconSize
	iconRight?: boolean
	isDisabled?: boolean
	isLoading?: boolean
} & JSX.IntrinsicElements['a']

const Link : React.FC<Props> = (
 args: Props
) => {

	const globalClass = styles.wrapperClass+'_link'
	const linkClasses = classNames({
		[`${globalClass}`]: true,
		[`${globalClass}_${args.colorScheme}`]: true,
		[`${globalClass}_loading`]: args.isLoading,
		[`${globalClass}_disabled`]: args.isDisabled || args.isLoading
	})

	const htmlAnchorAttributes = _.omit(args, 'colorScheme', 'label', 'icon', 'iconSize', 'isDisabled', 'iconRight', 'isLoading')
	return (
		<a {...htmlAnchorAttributes}
			className={`${linkClasses} ${args.className || ''}`}
		>
			{args.icon && !args.iconRight && 
				<Icon useIcon={args.icon} size={args.iconSize || IconSize.SMALL} />
			}

			{args.label}{args.children}

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
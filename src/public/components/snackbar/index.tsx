import styles from './snackbar.less'
import * as React from 'react'
import * as _ from 'underscore'
import Button, { ButtonSize, ButtonType } from '../button'
import { Enter } from '../icons'

export enum SnackbarType {
	MESSAGE = 'message',
	ERROR = 'error',
	WARNING = 'warning'
}

type Props = {
	type?: SnackbarType
	canDismiss?: boolean
	message: string | React.ReactElement
	action?: string
	onAction?: () => void
	onDismiss?: () => void
	timer?: number
}

const Snackbar : React.FC<Props> = (
	{
		type = SnackbarType.MESSAGE,
		canDismiss = false,
		message = '',
		action,
		onAction,
		onDismiss,
		timer
	} : Props
) => {
	const globalClass = styles.wrapperClass+'_snackbar' 

	return (
		<div className={`${globalClass}`} >
			<div className={`${globalClass}__message`}>{message}</div>
			{action &&
				<Button 
					label={action}
					size={ButtonSize.SMALL}
					type={ButtonType.GHOST}
					/>
			}
			{canDismiss && 
				<Button 
					icon={Enter}
					size={ButtonSize.SMALL}
					type={ButtonType.GHOST}
					/>
			}
		</div>
	)
}

export default Snackbar
import styles from './shortlink-display.less'
import React from 'react'
import _ from 'underscore'

type Props = {
	shortlink: string | undefined
}

export const ShortlinkDisplay : React.FC<Props> = function(
	{
		shortlink
	} : Props
) {

	const copyOnClick = () => {
		if(_.isFunction(navigator.clipboard.writeText) && shortlink) {
			navigator.clipboard.writeText(shortlink)
		} 
		// for IE?
		// else if (_.isFunction(window.clipboardData.setData)) { window.clipboardData.setData("Text", shortlink) }
	}
	
	return (
		<div className={styles.wrapperClass} onClick={copyOnClick}>

			{
				shortlink && 
				(<div className={``}>{shortlink}</div>)
			}

			{
				!shortlink &&
				(<div>{'(no link)'}</div>)
			}

		</div>
	)
}
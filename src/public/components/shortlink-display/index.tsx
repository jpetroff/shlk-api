import styles from './shortlink-display.less'
import React from 'react'
import _ from 'underscore'

type Props = {
	shortlink: string | null
}

export const ShortlinkDisplay : React.FC<Props> = function(
	{
		shortlink
	} : Props
) {
	if (shortlink == null) return (<div>{'(no link)'}</div>)

	const copyOnClick = () => {
		if(_.isFunction(navigator.clipboard.writeText)) {
			navigator.clipboard.writeText(shortlink)
		} 
		// for IE?
		// else if (_.isFunction(window.clipboardData.setData)) {
		// 	window.clipboardData.setData("Text", shortlink)
		// }
	}
	
	return (
		<div className={styles.shortlinkDisplay} onClick={copyOnClick}>
			{shortlink}
		</div>
	)
}
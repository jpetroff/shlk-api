import styles from './suggest-paste.less'

import React from 'react'
import _ from 'underscore'

type Props = {
	inputRef: React.RefObject<HTMLInputElement>
}

export const SuggestPaste : React.FC<Props> = function(
	{
		inputRef
	} : Props
) {
	const onClick = () => {
		if(_.isFunction(navigator.clipboard.readText) && inputRef.current) {
			inputRef.current.focus()
			navigator.clipboard.readText().then((clipText) => {
				if (inputRef.current) inputRef.current.value = clipText
			})
		}
	}

	return (
		<div className={styles.suggestPasteButton} onClick={onClick}>
			{'Click to paste link from clipboard'}
		</div>
	) 
}
import styles from './suggest-paste.less'

import React from 'react'
import _ from 'underscore'

type Props = {
	inputRef: React.RefObject<HTMLInputElement>;
	onSuccessPaste: (clipText: string) => void;
}

export const SuggestPaste : React.FC<Props> = function(
	{
		inputRef,
		onSuccessPaste
	} : Props
) {
	const handleClick = () => {
		if(_.isFunction(navigator.clipboard.readText) && inputRef.current) {
			inputRef.current.focus()
			navigator.clipboard.readText().then((clipText) => {
				if (clipText != '' && inputRef.current) {
					// inputRef.current.value = clipText
					onSuccessPaste(clipText)
				}
			})
		}
	}

	return (
		<div className={styles.suggestPasteButton} onClick={handleClick}>
			{'Click to paste link from clipboard'}
		</div>
	) 
}
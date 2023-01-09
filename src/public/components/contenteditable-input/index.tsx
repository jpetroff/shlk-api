import styles from './contenteditable-input.less'
import * as _ from 'underscore'
import * as React from 'react'
import ContentEditable, {ContentEditableEvent, Props} from 'react-contenteditable'

/* 

	NOT FINISHED
	Needs polishing and transformation rules (e.g. from here https://www.npmjs.com/package/replace-keywords)
	Not used in the project

*/

export interface ContentEditableInputEvent extends ContentEditableEvent {}

type ExtProps = Omit<Props, 'ref'> & {
	placeholder?: string;
}

export const ContentEditableInput : React.FC<ExtProps> = (
	props : ExtProps
) => { 
	const passProps : Omit<Props, 'ref'> = _.omit(props, ['placeholder', 'ref'])
	const [id] = React.useState<string>(btoa((Math.random() *100000).toString()).replace(/[=/+]/ig, ''))
	const placeholderStyle = `#${id}:after {content: '${_.isEmpty(props.html) ? props.placeholder : ''}'}`

	const handleKeyPress : (event: any) => void = (event) => {
		console.log(event.nativeEvent)
		if (event.nativeEvent.keyCode == 13) event.nativeEvent.preventDefault()
		if (event.nativeEvent.keyCode == 32) {
			event.nativeEvent.preventDefault()
			let pos = window.getSelection()
		}
	}

	return (
		<span className={styles.wrapperClass}>
			<ContentEditable
				id={id}
				{ ...passProps }
				className={`input__resizable ${props.className ? props.className : ''}`}
				onKeyPress={handleKeyPress}
			/>
			{
				<style>{placeholderStyle}</style>
			}
		</span>
	)
}
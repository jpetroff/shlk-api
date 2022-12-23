import _ from 'underscore'
import React from 'react'
import styles from './hero-input.less'

type Props = {
	onChange: (str: string) => void;
	onSubmit: () => void;
  placeholder: string;
  name: string;
  value?: string;
	inputRef?: React.RefObject<HTMLInputElement>
}

export const HeroInput : React.FC<Props> = function(
	{
		onChange,
		onSubmit,
		name,
		placeholder,
		value = "",
		inputRef
	} : Props
) {

	const [isFocus, setFocus] = React.useState(false)

	const handleKeyDown = (event: any) => {
		if (event.keyCode == 13 && _.isFunction(onSubmit)) {
			onSubmit()
		}
	}

	const handlePaste = () => {
		if(_.isFunction(navigator.clipboard.readText)) {
			navigator.clipboard.readText().then((clipText) => {
				if (clipText != '') {
					onChange(clipText)
					onSubmit()
				}
			})
		}
	}

	const handleClear = () => {
		onChange('')
	}

	const onFocus = () => setFocus(true)
	const onBlur = () => setFocus(false)

	return (
		<div className={styles.wrapperClass}>
			<input className={`hero-input`} id={styles.labelId}
				ref={inputRef}
				onChange={event => onChange(event.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
				name={name}
				value={value}
				/>
			<label 
				htmlFor={styles.labelId}
				className={`button button_ghost`}
				onClick={handleClear}
				>Clear</label>
			<label 
				htmlFor={styles.labelId} 
				className={`button button_ghost`}
				onClick={handlePaste}
				>Paste</label>
			<div 
				className={`placeholder placeholder_${(value != '') ? 'hide' : 'show'}`}
				>{placeholder}</div>
		</div>
	);
}
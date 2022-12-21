import _ from 'underscore'
import React from 'react'
import styles from './hero-input.less'

type Props = {
	onChange: (str: string) => void;
	onSubmit?: (str: string) => void;
  placeholder: string;
  name: string;
  value?: string;
	isFocus?: boolean;
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

	const handleKeyDown = (event: any) => {
		if (event.keyCode == 13 && _.isFunction(onSubmit)) {
			onSubmit(event.target.value)
		}
	}

	return (
		<div className={styles.heroInput}>
			<input ref={inputRef}
				className={'heroInputComponent'}
				onChange={event => onChange(event.target.value)}
				onKeyDown={handleKeyDown}
				name={name}
				placeholder={placeholder}
				value={value}
			/>
		</div>
	);
}
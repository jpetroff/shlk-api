import _ from 'underscore'
import React from 'react'
import styles from './hero-input.less'

import Button, { ButtonSize, ButtonType } from '../button'
import { Cross, Enter } from '../icons'
import { testShortcutPasteWithKeyboard } from '../../js/utils'
import clipboardTools from '../../js/clipboard-tools'

type Props = {
	onChange: (str: string) => void;
	onSubmit: () => void;
  placeholder: string;
  name: string;
  value?: string;
	inputRef?: React.RefObject<HTMLInputElement>
}

const HeroInput : React.FC<Props> = function(
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

	const handlePaste = async () => {
		const clipText = await clipboardTools.paste()
		if(clipText && clipText != '') {
			onChange(clipText)
			onSubmit()
		}
	}

	const handleClear = () => {
		onChange('')
	}

	const onFocus = () => setFocus(true)
	const onBlur = () => setFocus(false)

	let wrapperMods : Array<string> = []

	if(isFocus) wrapperMods.push(styles.wrapperClass+'_focus')
	if(testShortcutPasteWithKeyboard()) wrapperMods.push(styles.wrapperClass+'_can-shortcut-paste')
	if(value && value != '') {
		wrapperMods.push(styles.wrapperClass+'_not-empty')
	} else {
		wrapperMods.push(styles.wrapperClass+'_empty')
	}

	return (
		<div className={`${styles.wrapperClass} ${wrapperMods.join(' ')}`}>
			<input className={`hero-input`} id={styles.labelId}
				ref={inputRef}
				onChange={event => onChange(event.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
				name={name}
				value={value}
				/>
				<div className={`hero-input__actions`}>
					<label htmlFor={styles.labelId}>
						<Button 
							className={'hero-input__clear'}
							icon={Cross}
							type={ButtonType.GHOST_PRIMARY}
							size={ButtonSize.LARGE}
							onClick={handleClear}
							/>
					</label>						
					<label htmlFor={styles.labelId}>
						<Button 
							className={'hero-input__paste'}
							label='Paste'
							type={ButtonType.PRIMARY}
							size={ButtonSize.LARGE}
							onClick={handlePaste}
							/>
					</label>
					<Button
						icon={Enter}
						className={'hero-input__create'}
						label='Create'
						type={ButtonType.PRIMARY}
						size={ButtonSize.LARGE}
						onClick={onSubmit}
						/>
				</div>
			<div 
				className={`placeholder placeholder_${(value != '') ? 'hide' : 'show'}`}
				>{placeholder}</div>
		</div>
	);
}

export default HeroInput
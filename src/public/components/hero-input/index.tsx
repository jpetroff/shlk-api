import _ from 'underscore'
import React from 'react'
import styles from './hero-input.less'

import Button, { ButtonSize, ButtonType } from '../button'
import { Cross, Enter } from '../icons'
import { canShortcutPasteWithKeyboard, checkMobileMQ } from '../../js/utils'
import clipboardTools from '../../js/clipboard-tools'

type Props = {
	onChange: (str: string, isClearPress?: boolean) => void;
	onSubmit: () => void;
  placeholder: string;
  name: string;
  value?: string;
	inputRef?: React.RefObject<HTMLInputElement>
	onFocus?: (event: Event) => void
	onBlur?: (event: Event) => void
	mobileTip?: string
}

const HeroInput : React.FC<Props> = function(
	{
		onChange,
		onSubmit,
		name,
		placeholder,
		value = "",
		inputRef,
		onFocus,
		onBlur,
		mobileTip
	} : Props
) {

	const [isFocus, setFocus] = React.useState(false)
	const inputId = React.useId()

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

	const handleClear = (event: React.SyntheticEvent<HTMLAnchorElement, Event>) => {
		let doubleClick = false
		if(value == '') doubleClick = true
		onChange('', true)
		if(doubleClick) event.preventDefault()
	}

	const handleFocus = () => setFocus(true)
	const handleBlur = () => setFocus(false)

	const globalClass = styles.wrapperClass+'_hero-input'
	let wrapperMods : Array<string> = []

	if(isFocus) wrapperMods.push(globalClass+'_focus')
	if(canShortcutPasteWithKeyboard()) wrapperMods.push(globalClass+'_can-shortcut-paste')
	if(value && value != '') {
		wrapperMods.push(globalClass+'_not-empty')
	} else {
		wrapperMods.push(globalClass+'_empty')
	}

	return (
		<div className={`${globalClass} ${wrapperMods.join(' ')}`}>
			<input className={`${globalClass}__input-elem`} id={inputId}
				ref={inputRef}
				onChange={event => onChange(event.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				name={name}
				value={value}
				autoComplete='off'
				/>
			<label htmlFor={inputId} className={`${globalClass}__actions ${globalClass}__clear`}>
				<Button 
					icon={Cross}
					type={ButtonType.GHOST_PRIMARY}
					size={ButtonSize.LARGE}
					onClick={handleClear}
					/>
			</label>
			<div className={`${globalClass}__actions ${globalClass}__cta-actions`}>
				{mobileTip && <span className={`${globalClass}__cta-actions__mobile-tip`}>
					{mobileTip}
				</span>}
				<label htmlFor={inputId} className={`${globalClass}__paste`}>
					<Button 
						label='Paste'
						type={ButtonType.PRIMARY}
						size={ButtonSize.LARGE}
						onClick={handlePaste}
						/>
				</label>
				<Button
					icon={Enter}
					className={`${globalClass}__create`}
					label='Create'
					type={ButtonType.PRIMARY}
					size={ButtonSize.LARGE}
					onClick={onSubmit}
					/>
			</div>
			<div className={`${globalClass}__placeholder ${globalClass}__placeholder_${(value != '') ? 'hide' : 'show'}`}>
				{placeholder}
			</div>
		</div>
	);
}

export default HeroInput
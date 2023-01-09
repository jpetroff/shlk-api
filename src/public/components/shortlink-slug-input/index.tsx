import styles from './shortlink-slug-input.less'
import * as _ from 'underscore'
import * as React from 'react'
import Link, { LinkColors } from '../link'
import Button, { ButtonSize, ButtonType } from '../button'

export type TextPattern = {
	key: string
	value: string
	readOnly?: boolean
	placeholder?: string
	lineBreak?: boolean
	mobileLineBreak?: boolean
}

export enum SlugInputSpecialChars {
	mobileLineBreak = '__mobileLineBreak__',
	lineBreak = '__lineBreak__'
}

type Props = {
	text: Array<TextPattern | string>
	onChange: (value: string, type: string) => void
	show?: boolean
	generatedLink?: string
	isLoading?: boolean
	hasCta?: boolean
}

export const ShortlinkSlugInput : React.FC<Props> = (
	{
		text,
		onChange,
		show = true,
		isLoading = false,
		generatedLink,
		hasCta = true
	} : Props
) => {

	const globalClass = styles.wrapperClass+'_slug-input'

	const hideClass = show ? '' : globalClass + '_hide';

	let linkLabel : string = '← Copy custom shortlink'
	if(_.isEmpty(generatedLink)) linkLabel = ''
	if(isLoading) linkLabel = 'Loading...'

	let btnLabel : string = 'Copy'
	if(isLoading) linkLabel = 'Loading'

	const activeActionWrapperClass = !_.isEmpty(generatedLink) ? globalClass+'__action-wrapper_has-shortlink' : ''

	function handleCopy () {
		if(_.isFunction(navigator.clipboard.writeText) && generatedLink) {
			navigator.clipboard.writeText(generatedLink)
		} 
	}

	return (
		<div className={`${globalClass} ${hideClass}`}>
			<div className={`${globalClass}__label`}>Customize link further with a custom slug</div>
			<div className={`${globalClass}__content-wrapper`}>
				<div className={`${globalClass}__action-wrapper ${activeActionWrapperClass}`} 
				onClick={handleCopy}
			>
				<div className={`${globalClass}__constructed-input`}>
					{text.map((chunk: TextPattern | string, index ) => {
							if (_.isString(chunk)) {
								switch(chunk) {
									case SlugInputSpecialChars.mobileLineBreak : 
										return (<br key={index} className={`${globalClass}__mlbr`} />)
									case SlugInputSpecialChars.lineBreak : 
										return (<br key={index} className={`${globalClass}__lbr`} />)
									default : 
										return (<span key={index} className={`${globalClass}_text-filler ${globalClass}__input-common-style`}>{chunk}</span>)
								}
							} else {
								const mobileBreakClass = chunk.mobileLineBreak ? `${globalClass}_mlbreak` : ''
								const lineBreakClass = chunk.lineBreak ? `${globalClass}_lbreak` : ''
								return (
									<span key={index} className={`${globalClass}__input-resizable`}>
										<input 
											className={`${globalClass}__input-resizable__real-input ${globalClass}__input-common-style`}
											value={chunk.value}
											onChange={(event) => {onChange(event.target.value, chunk.key)}}
										/>
										<span className={`${globalClass}__input-resizable__width-sizer ${globalClass}__input-common-style ${globalClass}__input-resizable__width-sizer_${chunk.value ? 'hide' : 'show'}`}>{chunk.value || chunk.placeholder}</span>
									</span>	
								)
							}
						})
					}
				</div>
				<Link 
						href='#'
						className={`${globalClass}__copy_pseudolink`}
						colorScheme={LinkColors.APP}
						isDisabled={_.isEmpty(generatedLink)}
						isLoading={isLoading}
						label={linkLabel}
						/>
				</div>
				{
					(isLoading || !_.isEmpty(generatedLink)) &&
					<Button
						className={`${globalClass}__copy_button`}
						label={btnLabel}
						size={ButtonSize.LARGE}
						type={hasCta ? ButtonType.PRIMARY : ButtonType.SECONDARY}
						isDisabled={_.isEmpty(generatedLink)}
						isLoading={isLoading}
						onClick={handleCopy}
						/>
				}
			</div>
		</div>
	)

}

export default ShortlinkSlugInput
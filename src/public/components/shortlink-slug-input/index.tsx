import styles from './shortlink-slug-input.less'
import _ from 'underscore'
import React from 'react'
import Link, { LinkColors } from '../link'

export type TextPattern = {
	key: string
	value: string
	readOnly?: boolean
	placeholder?: string
}

type Props = {
	text: Array<TextPattern | string>
	onChange: (value: string, type: string) => void
	show?: boolean
	generatedLink?: string
	isLoading?: boolean
}

export const ShortlinkSlugInput : React.FC<Props> = (
	{
		text,
		onChange,
		show = true,
		isLoading = false,
		generatedLink
	} : Props
) => {

	const hideClass = show ? '' : styles.wrapperClass + '_hide';

	let linkLabel : string = '← Copy custom shortlink'
	if(_.isEmpty(generatedLink)) linkLabel = ''
	if(isLoading) linkLabel = 'Loading...'

	const activeActionWrapperClass = !_.isEmpty(generatedLink) ? 'slug-input__action-wrapper_has-shortlink' : ''

	function handleCopy () {
		if(_.isFunction(navigator.clipboard.writeText) && generatedLink) {
			navigator.clipboard.writeText(generatedLink)
		} 
	}

	return (
		<div className={`${styles.wrapperClass} ${hideClass}`}>
			<div className='slug-input__label'>Customize link further with a custom slug</div>
			<div className={`slug-input__action-wrapper ${activeActionWrapperClass}`} 
				onClick={handleCopy}
			>
				<div className='slug-input-wrapper'>
					{text.map((chunk: TextPattern | string, index ) => {
							if (_.isString(chunk)) {
								return (<span key={index} className={`text-filler input-common-style`}>{chunk}</span>)
							} else {
								return (
									<span key={index} className={`input-resizable`}>
										<input 
											className={`input-resizable__real-input input-common-style`}
											value={chunk.value}
											onChange={(event) => {onChange(event.target.value, chunk.key)}}
										/>
										<span className={`input-resizable__width-sizer input-common-style input-resizable__width-sizer_${chunk.value ? 'hide' : 'show'}`}>{chunk.value || chunk.placeholder}</span>
									</span>	
								)
							}
						})
					}
				</div>
				<Link 
						href='#'
						className='slug-input__copy_pseudolink'
						colorScheme={LinkColors.APP}
						isDisabled={_.isEmpty(generatedLink)}
						isLoading={isLoading}
						label={linkLabel}
						/>
			</div>
		</div>
	)

}
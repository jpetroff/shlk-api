import styles from './shortlink-display.less'
import React from 'react'
import _ from 'underscore'
import Link, { LinkColors } from '../link'
import clipboardTools from '../../js/clipboard-tools'

type Props = {
	shortlink: string | undefined
	isLoading?: boolean
	placeholder?: string
	hashLength?: number
}

export const ShortlinkDisplay : React.FC<Props> = function(
	{
		placeholder,
		hashLength,
		shortlink,
		isLoading = false
	} : Props
) {

	function copyOnClick() {
		if(shortlink) {
			clipboardTools.copy(shortlink)
		}
	}

	const globalClass = 'shortlink-display'

	let shortlinkDisplayMods : Array<string> = []
	if(_.isEmpty(shortlink)) shortlinkDisplayMods.push(globalClass+'_empty')

	const placeholderText = placeholder + '/____'
	let linkLabel : string = '← Copy shortlink'
	if(isLoading) linkLabel = 'Loading...'
	if(_.isEmpty(shortlink)) linkLabel = '← Link will appear here'

	const displayShortlink : string = (new String(shortlink)).replace(/^https?\:\/\//ig,'')

	const activeActionWrapperClass = !_.isEmpty(shortlink) ? 'shortlink-display__action-wrapper_has-shortlink' : ''

	return (
		<div className={`${styles.wrapperClass} ${globalClass} ${shortlinkDisplayMods.join(' ')}`} 
			onClick={copyOnClick}
		>
			<div className={`shortlink-display__action-wrapper ${activeActionWrapperClass}`} 
				onClick={copyOnClick}
			>
				<span className={'shortlink-display__text'}>
					{shortlink ? displayShortlink : placeholderText}
				</span>

				<Link 
					href='#'
					className='shortlink-display__copy_pseudolink'
					colorScheme={LinkColors.APP}
					isDisabled={_.isEmpty(shortlink)}
					isLoading={isLoading}
					label={linkLabel}
					/>
			</div>
		</div>
	)
}
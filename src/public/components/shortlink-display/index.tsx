import styles from './shortlink-display.less'
import React from 'react'
import _ from 'underscore'
import Link, { LinkColors } from '../link'

type Props = {
	shortlink: string | undefined
	isLoading?: boolean
}

export const ShortlinkDisplay : React.FC<Props> = function(
	{
		shortlink,
		isLoading = false
	} : Props
) {

	function copyOnClick() {
		if(_.isFunction(navigator.clipboard.writeText) && shortlink) {
			navigator.clipboard.writeText(shortlink)
		} 
		// for IE?
		// else if (_.isFunction(window.clipboardData.setData)) { window.clipboardData.setData("Text", shortlink) }
	}

	const globalClass = 'shortlink-display'

	let shortlinkDisplayMods : Array<string> = []
	if(_.isEmpty(shortlink)) shortlinkDisplayMods.push(globalClass+'_empty')

	const placeholderText = window.location.host + '/____'
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
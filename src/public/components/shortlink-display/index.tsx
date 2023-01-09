import styles from './shortlink-display.less'
import * as React from 'react'
import * as _ from 'underscore'
import Link, { LinkColors } from '../link'
import Button, { ButtonSize, ButtonType } from '../button'
import clipboardTools from '../../js/clipboard-tools'
import linkTools from '../../js/url-tools'

type Props = {
	shortlink: string | undefined
	isLoading?: boolean
	placeholder?: string
	hashLength?: number,
	hasCta?: boolean
}

export const ShortlinkDisplay : React.FC<Props> = function(
	{
		placeholder,
		hashLength,
		shortlink,
		isLoading = false,
		hasCta = true
	} : Props
) {

	function copyOnClick() {
		if(shortlink) {
			clipboardTools.copy(shortlink)
		}
	}

	const globalClass = styles.wrapperClass+'_shortlink-display'

	let shortlinkDisplayMods : Array<string> = []
	if(_.isEmpty(shortlink)) shortlinkDisplayMods.push(globalClass+'_empty')

	const placeholderText = placeholder + '/____'

	let linkLabel : string = '← Copy shortlink'
	if(isLoading) linkLabel = 'Loading'
	if(_.isEmpty(shortlink)) linkLabel = '← Link will appear here'

	let btnLabel : string = 'Copy'
	if(isLoading) linkLabel = 'Loading'

	const displayShortlink : string = (new String(shortlink)).replace(/^https?\:\/\//ig,'')

	const activeActionWrapperClass = !_.isEmpty(shortlink) ? 'shortlink-display__action-wrapper_has-shortlink' : ''

	return (
		<div className={`${globalClass} ${shortlinkDisplayMods.join(' ')}`} 
			onClick={copyOnClick}
		>
			<div className={`${globalClass}__action-wrapper ${activeActionWrapperClass}`} 
				onClick={copyOnClick}
			>
				<span className={`${globalClass}__text`}>
					{shortlink ? displayShortlink : placeholderText}
				</span>

				<Link 
					href='#'
					className={`${globalClass}__copy-pseudolink`}
					colorScheme={LinkColors.APP}
					isDisabled={_.isEmpty(shortlink)}
					isLoading={isLoading}
					label={linkLabel}
					/>
			</div>
			{
				(isLoading || !_.isEmpty(shortlink)) &&
				<Button
					className={`${globalClass}__copy-button`}
					label={btnLabel}
					size={ButtonSize.LARGE}
					type={hasCta ? ButtonType.PRIMARY : ButtonType.SECONDARY}
					isDisabled={_.isEmpty(shortlink)}
					isLoading={isLoading}
					/>
			}
		</div>
	)
}

export default ShortlinkDisplay
/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'
import { HTMLAnyInput, modifyURLSlug } from '../../js/_utils'

import React from 'react'
import _ from 'underscore'

import { HeroInput } from '../../components/hero-input/index'
import { ShortlinkDisplay } from '../../components/shortlink-display'
import { ShortlinkSlugInput, TextPattern } from '../../components/shortlink-slug-input'

import Query from './shortlink-queries'


type Props = {}

type State = {
	location: string
	generatedShortlink: string | undefined
	generatedHash: string | undefined
	userTag: string
	descriptionTag: string
	errorState: {
		createLinkResult: Error | undefined
	}
}


export class Home extends React.Component<Props, State> {
	private baseUrl: string

	private heroInputRef: React.RefObject<HTMLAnyInput>

	constructor(props) {
    super(props)
		this.baseUrl = window.location.origin

    this.state = {
			location: '',
			generatedShortlink: undefined,
			generatedHash: undefined,
			userTag: 'evgn',
			descriptionTag: '',
			errorState: {
				createLinkResult: undefined
			}
		}
		this.heroInputRef = React.createRef<HTMLAnyInput>()
		_.bindAll(this, 'updateLocation', 'submitLocation', 'handleSuccessPaste', 'handleDescriptorChange', '_submitDescriptor')
		this.submitDescriptor = _.debounce(this._submitDescriptor, 500)
  }

	componentDidMount() {
    if(this.heroInputRef.current) this.heroInputRef.current.focus();
  }

	updateLocation(str: string) {
		this.setState({
			location: str.trim(),
			generatedShortlink: undefined
		})
	}

	submitLocation() {
		const location = this.state.location.trim()
		if (_.isEmpty(location)) return

		Query.createShortlink(location)
			.then( (result) => {
				console.log('[Home] submitLocation\n', result)
				if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${location}' was not created. Please, try again`)

				this.setState({
					generatedShortlink: `${this.baseUrl}/${result.hash}`,
					generatedHash: result.hash,
					location: result.location || this.state.location,
					errorState: {
						createLinkResult: undefined
					}
				})
			})
			.catch( (err) => {
				this.setState({errorState: {createLinkResult: err}})
				console.error(err) 
			})
	}

	handleSuccessPaste(clipText: string) {
		this.setState({
			location: clipText
		})
		this.submitLocation()
	}

	handleDescriptorChange(value: string, type: string) {
		if(type == 'userTag') this.setState( {userTag: modifyURLSlug(value)} )
		else if(type == 'descriptionTag') this.setState( {descriptionTag: modifyURLSlug(value)} )
		this.submitDescriptor()
	}

	public submitDescriptor: (() => void) & _.Cancelable;
	// debounced in constructor
	private _submitDescriptor() {
		console.log('[Home] submitDescriptor\n', this.state.userTag, this.state.descriptionTag)
		if(_.isEmpty(this.state.descriptionTag)) { return }

		Query.createShortlinkDescriptor( 
			{ userTag: this.state.userTag, 
				descriptionTag: this.state.descriptionTag,
				location: this.state.location,
				hash: this.state.generatedHash
			}
		)
			.catch( (err) => {
				console.error(err)
			})
	}

	private _generateTextPattern(): Array<TextPattern | string> {
		return [
			this.baseUrl+'/',
			{ key: 'userTag', value: this.state.userTag, placeholder: 'user' },
			'@',
			{ key: 'descriptionTag', value: this.state.descriptionTag, placeholder: 'your-custom-url' },
		]
	}

	render() {
		return (
			<div className={`${styles.homepage} body__layout`}>
				<div className={`body__layout__offset-wrapper`}>
					<HeroInput 
						inputRef={this.heroInputRef}
						onChange={this.updateLocation}
						onSubmit={this.submitLocation}
						name="short url"
						placeholder="Enter URL"
						value={this.state.location}
					/>
				</div>
				<ShortlinkDisplay
					shortlink={this.state.generatedShortlink}
				/>
				<ShortlinkSlugInput
					text={this._generateTextPattern()}
					onChange={this.handleDescriptorChange}
				/>
			</div>
		)
	}
}
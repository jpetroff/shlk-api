/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'

import React from 'react'
import _ from 'underscore'

import { HeroInput } from '../../components/hero-input/index'
import { ShortlinkDisplay } from '../../components/shortlink-display'
import { SuggestPaste } from '../../components/suggest-paste'

import Query from './shortlink-queries'

type Props = {}

type State = {
	location: string
	generatedShortlink: string | null
	errorState: {
		createLinkResult: Error | null
	}
}


export class Home extends React.Component<Props, State> {
	private baseUrl: string

	private heroInputRef: React.RefObject<HTMLInputElement>

	constructor(props) {
    super(props)
		this.baseUrl = window.location.origin

    this.state = {
			location: '',
			generatedShortlink: null,
			errorState: {
				createLinkResult: null
			}
		}
		this.heroInputRef = React.createRef<HTMLInputElement>()
		_.bindAll(this, 'updateLocation', 'submitLocation', 'handleSuccessPaste')
  }

	componentDidMount() {
    if(this.heroInputRef.current) this.heroInputRef.current.focus();
  }

	updateLocation(str: string) {
		this.setState({
			location: str,
			generatedShortlink: null
		})
	}

	submitLocation() {
		const location = this.state.location
		console.log(this.state.location, location)
		Query.createShortlink(location)
			.then( (result) => {
				console.log(result)
				if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${location}' was not created. Please, try again`)

				this.setState({
					generatedShortlink: `${this.baseUrl}/${result.hash}`,
					errorState: {
						createLinkResult: null
					}
				})
			})
			.catch( (err) => {
				this.setState({errorState: {createLinkResult: err}})
				console.log(err) 
			})
	}

	handleSuccessPaste(clipText: string) {
		this.setState({
			location: clipText
		})
		this.submitLocation()
	}

	render() {
		return (
			<div className={styles.homepage}>
				<HeroInput 
					inputRef={this.heroInputRef}
					onChange={this.updateLocation}
					onSubmit={this.submitLocation}
					name="short url"
					placeholder="Enter URL"
					value={this.state.location}
				/>
				<ShortlinkDisplay
					shortlink={this.state.generatedShortlink}
				/>
				<SuggestPaste 
					inputRef={this.heroInputRef}
					onSuccessPaste={this.handleSuccessPaste}
				/>
			</div>
		)
	}
}
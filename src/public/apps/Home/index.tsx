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
	heroInputValue: string
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
			heroInputValue: '',
			generatedShortlink: null,
			errorState: {
				createLinkResult: null
			}
		}
		this.heroInputRef = React.createRef<HTMLInputElement>()
		_.bindAll(this, 'onChange', 'onSubmit')
  }

	onChange(str: string) {
		this.setState({
			heroInputValue: str,
			generatedShortlink : null
		})
	}

	componentDidMount() {
    if(this.heroInputRef.current) this.heroInputRef.current.focus();
  }

	onSubmit(location: string) {
		console.log(location)
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

	render() {
		return (
			<div className={styles.homepage}>
				<HeroInput 
					inputRef={this.heroInputRef}
					onChange={this.onChange}
					onSubmit={this.onSubmit}
					name="short url"
					placeholder="Enter URL"
					value={this.state.heroInputValue}
				/>
				<ShortlinkDisplay
					shortlink={this.state.generatedShortlink}
				/>
				<SuggestPaste 
					inputRef={this.heroInputRef}
				/>
			</div>
		)
	}
}
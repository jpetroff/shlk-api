/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'
import { HTMLAnyInput, modifyURLSlug } from '../../js/_utils'

import React from 'react'
import _, { result } from 'underscore'

import HeroInput from '../../components/hero-input/index'
import { ShortlinkDisplay } from '../../components/shortlink-display'
import { ShortlinkSlugInput, TextPattern } from '../../components/shortlink-slug-input'

import Query from './shortlink-queries'
import LSC from './localstorage-cache'

import { Header } from '../Header'

type Props = {}

type State = {
	location: string
	generatedShortlink: string | undefined
	generatedDescriptiveShortlink: string | undefined
	generatedHash: string | undefined
	userTag: string
	descriptionTag: string
	errorState: {
		createLinkResult?: Error
		createDescriptiveLinkResult?: Error
	}
	loadingState: {
		createLinkIsLoading?: boolean
		createDescriptiveLinkIsLoading?: boolean
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
			generatedDescriptiveShortlink: undefined,
			generatedHash: undefined,
			userTag: 'evgn',
			descriptionTag: '',
			errorState: {},
			loadingState: {
				createLinkIsLoading: false,
				createDescriptiveLinkIsLoading: false
			}
		}
		this.heroInputRef = React.createRef<HTMLAnyInput>()
		_.bindAll(this, 'updateLocation', 'submitLocation', 'handleSuccessPaste', 'handleDescriptorChange', '_submitDescriptor', 'saveLSCache')
		this.submitDescriptor = _.debounce(this._submitDescriptor, 500)
  }

	componentDidMount() {
    if(this.heroInputRef.current) this.heroInputRef.current.focus();
  }

	updateLocation(str: string) {
		this.setState({
			location: str.trim(),
			generatedShortlink: undefined,
			generatedDescriptiveShortlink: undefined,
			generatedHash: undefined,
		})
	}

	private setShortlinkState( args: { location: string, hash: string, userTag?: string, descriptionTag?: string} ) {
		console.log(args)
		let newState: any = {
			generatedShortlink: `${this.baseUrl}/${args.hash}`,
			generatedHash: args.hash,
			location: args.location,
			errorState: {
				createLinkResult: undefined
			}
		}
		if(args.descriptionTag) {
			const userTag = args.userTag ? args.userTag+'@' : ''
			const descriptionTag = args.descriptionTag
			const slugInputText = this._generateTextPattern()
			newState = {
				...newState,
				generatedDescriptiveShortlink: `${this.baseUrl}/${userTag}${descriptionTag}`,
				slugInputText
			}
		}
		this.setState(newState)
		_.defer(this.saveLSCache)
	}

	private retrieveLSCache() : boolean {
		const cachedURL = LSC.checkShortlinkCache( {url: this.state.location} )

		if(cachedURL == null || !cachedURL.hash) return false

		if(
			this.state.userTag != cachedURL.userTag ||
			(this.state.descriptionTag != '' && this.state.descriptionTag != cachedURL.descriptionTag)
		) return false 

		console.log('[LS] Retrieved object:\n',cachedURL)
		this.setShortlinkState({
			location: cachedURL.url,
			hash: cachedURL.hash,
			userTag: cachedURL.userTag,
			descriptionTag: cachedURL.descriptionTag
		})
		return true
	}

	private saveLSCache() {
		if(!this.state.generatedHash) console.error('Empty hash to be saved!')
		LSC.storeShortlink({
			url: this.state.location,
			hash: this.state.generatedHash,
			userTag: this.state.userTag,
			descriptionTag: this.state.descriptionTag
		})
	}

	submitLocation() {
		const location = this.state.location.trim()
		if (_.isEmpty(location)) return

		if(this.retrieveLSCache()) return

		this.setState({loadingState: {createLinkIsLoading: true}})
		Query.createShortlink(location)
			.then( (result) => {
				console.log('[Home] submitLocation\n', result)
				if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${location}' was not created. Please, try again`)

				this.setShortlinkState({
					location: result.location,
					hash: result.hash
				})
			})
			.catch( (err) => {
				this.setState({errorState: {createLinkResult: err}})
				console.error(err) 
			})
			.then( () => {
				this._clearErrorState()
				this.setState({loadingState: {createLinkIsLoading: false}})
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

		this.setState({loadingState: {createDescriptiveLinkIsLoading: true}})
		this.submitDescriptor()
	}

	public submitDescriptor: (() => void) & _.Cancelable;
	private _submitDescriptor() {
		console.log('[Home] submitDescriptor\n', this.state.userTag, this.state.descriptionTag)
		if(_.isEmpty(this.state.descriptionTag)) { return }

		if(this.retrieveLSCache()) return
		
		Query.createShortlinkDescriptor( 
			{ userTag: this.state.userTag, 
				descriptionTag: this.state.descriptionTag,
				location: this.state.location,
				hash: this.state.generatedHash
			}
		)
			.then( (result) => {
				if(!result || !result.descriptor) return;
				this.setShortlinkState({
					location: result.location,
					hash: result.hash,
					userTag: result.descriptor.userTag,
					descriptionTag: result.descriptor.descriptionTag
				})				
			})
			.catch( (err) => {
				console.error(err)
			})
			.then( () => {
				this._clearErrorState()
				this.setState({loadingState: {createDescriptiveLinkIsLoading: false}})
			})
	}

	private _generateTextPattern(): Array<TextPattern | string> {
		return [
			this.baseUrl.replace(/^https?:\/\//ig, '')+'/',
			{ key: 'userTag', value: this.state.userTag, placeholder: 'user' },
			'@',
			{ key: 'descriptionTag', value: this.state.descriptionTag, placeholder: 'your-custom-url' },
		]
	}

	private _clearErrorState(): void {
		this.setState({ errorState: {} })
	}

	render() {
		return (
			<>
				<Header />
				<div className={`${styles.homepage} body__layout`}>
					<div className={`body__layout__offset-wrapper`}>
						<HeroInput 
							inputRef={this.heroInputRef}
							onChange={this.updateLocation}
							onSubmit={this.submitLocation}
							name="URL"
							placeholder="Type or paste a link"
							value={this.state.location}
						/>
					</div>
					<ShortlinkDisplay
						shortlink={this.state.generatedShortlink}
						isLoading={this.state.loadingState.createLinkIsLoading}
					/>
					{this.state.generatedShortlink && 
						<ShortlinkSlugInput
							text={this._generateTextPattern()}
							onChange={this.handleDescriptorChange}
							show={this.state.generatedShortlink ? true : false}
							generatedLink={this.state.generatedDescriptiveShortlink}
							isLoading={this.state.loadingState.createDescriptiveLinkIsLoading}
						/>
					}
				</div>
			</>
		)
	}
}
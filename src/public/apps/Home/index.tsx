/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'
import { modifyURLSlug, validateURL } from '../../js/utils'
import { HTMLAnyInput, AnyObject } from '../../js/constants'
import config from '../../js/config.development'
import { WithRouterProps } from '../../js/router-hoc'

import React from 'react'
import _, { result } from 'underscore'

import HeroInput from '../../components/hero-input/index'
import { ShortlinkDisplay } from '../../components/shortlink-display'
import { ShortlinkSlugInput, TextPattern } from '../../components/shortlink-slug-input'

import Query from '../../js/shortlink-queries'
import LSC from '../../js/localstorage-cache'

import { Header } from '../Header'

import {} from 'react-router-dom'

type Props = {
	router?: WithRouterProps
	extension?: AnyObject
}

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
		this.baseUrl = config.serviceUrl

		const [ predefinedLocation ] = this.checkUrlParams(['l'], props.router)
    this.state = {
			location: _.unescape(predefinedLocation || ''),
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
		this.updateDeferredLOcation = _.once( () => this.props.extension?.activeTabUrl && this.setState({ location: this.props.extension.activeTabUrl}) )
  }

	// @TODO: refactor — make splitting function in utils
	checkUrlParams(queryParam: string[], router?: WithRouterProps) : Array<string | null> {
		if(!router) return []
		const searchParams = new URLSearchParams(router.location.search)
		let result : Array<string | null> = []
		_.forEach(queryParam, (param) => {
			result.push(searchParams.get(param))
		})
		_.map(result, (item) => {
			if(item != null) return decodeURIComponent(item)
		})
		return result 
	}

	componentDidMount() {
    if(this.heroInputRef.current) this.heroInputRef.current.focus()
		if(validateURL(this.state.location)) this.submitLocation()
  }

	componentDidUpdate() {
		console.log('UPD', this.props)
		if(
			this.props.extension?.activeTabUrl != this.state.location
		) this.updateDeferredLOcation()
	}
	private updateDeferredLOcation : () => void

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
		if(!_.isEmpty(args.descriptionTag)) {
			const userTagPart = args.userTag ? args.userTag+'@' : ''
			const descriptionTagPart = args.descriptionTag
			newState = {
				...newState,
				userTag: args.userTag,
				descriptionTag: args.descriptionTag,
				generatedDescriptiveShortlink: `${this.baseUrl}/${userTagPart}${descriptionTagPart}`
			}
		}
		this.setState(newState)
		_.defer(this.saveLSCache)
	}

	private async retrieveLSCache() : Promise<boolean> {
		const cachedURL = await LSC.checkShortlinkCache( {url: this.state.location} )

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

	async submitLocation() {
		this._clearErrorState()
		const location = this.state.location.trim()
		if (_.isEmpty(location)) return
		
		const cachedResult = await this.retrieveLSCache()
		if(cachedResult) return

		this.setState({loadingState: {createLinkIsLoading: true}})
		try {
			const result = await Query.createShortlink(location)
			console.log('[Home] submitLocation\n', result)
			if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${location}' was not created. Please, try again`)

			this.setShortlinkState({
				location: result.location,
				hash: result.hash
			})
		} catch (err) {
			this.setState({errorState: {createLinkResult: err}})
			console.error(err) 
		}
		this.setState({loadingState: {createLinkIsLoading: false}})
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
	private async _submitDescriptor() {
		this._clearErrorState()
		console.log('[Home] submitDescriptor\n', this.state.userTag, this.state.descriptionTag)
		if(_.isEmpty(this.state.descriptionTag)) { return }

		if(await this.retrieveLSCache()) return
		
		try {
			const result = await Query.createShortlinkDescriptor( 
				{ userTag: this.state.userTag, 
					descriptionTag: this.state.descriptionTag,
					location: this.state.location,
					hash: this.state.generatedHash
				}
			)

			if(!result || !result.descriptor) return;
			this.setShortlinkState({
				location: result.location,
				hash: result.hash,
				userTag: result.descriptor.userTag,
				descriptionTag: result.descriptor.descriptionTag
			})		
		} catch (err) {
			console.error(err)
		}
		this.setState({loadingState: {createDescriptiveLinkIsLoading: false}})
	}

	private _generateTextPattern(): Array<TextPattern | string> {
		return [
			config.displayServiceUrl+'/',
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
						placeholder={config.displayServiceUrl}
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
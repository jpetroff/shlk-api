/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'
import { checkMobileMQ, modifyURLSlug, validateURL } from '../../js/utils'
import { HTMLAnyInput, AnyObject } from '../../js/constants'
import config from '../../js/config.development'
import { WithRouterProps } from '../../js/router-hoc'

import React from 'react'
import _ from 'underscore'

import HeroInput from '../../components/hero-input/index'
import ShortlinkDisplay from '../../components/shortlink-display'
import ShortlinkSlugInput, { TextPattern, SlugInputSpecialChars } from '../../components/shortlink-slug-input'
import linkTools from '../../js/url-tools'
import clipboardTools from '../../js/clipboard-tools'

import Query from '../../js/shortlink-queries'
import LSC from '../../js/localstorage-cache'

import Header from '../Header'

import {} from 'react-router-dom'

enum globalCommands {
	submitAndCopy = 0
}

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
	mobileConvenienceInput: boolean
}


export class Home extends React.Component<Props, State> {
	private heroInputRef: React.RefObject<HTMLAnyInput>

	constructor(props) {
    super(props)

		const [ predefinedLocation ] = linkTools.queryUrlSearchParams(['l'], props.router?.location?.search)
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
			},
			mobileConvenienceInput: false
		}
		this.heroInputRef = React.createRef<HTMLAnyInput>()
		// _.bindAll(this, 'updateLocation', 'submitLocation', 'handleSuccessPaste', 'handleDescriptorChange', '_submitDescriptor', 'saveLSCache')
		_.bindAll(this, ..._.functions(this))
		this.submitDescriptor = _.debounce(this._submitDescriptor, 500)
		this.updateDeferredLocation = _.once( () => this.props.extension?.activeTabUrl && this.setState({ location: this.props.extension.activeTabUrl}) )
  }

	componentDidMount() {
    if(
				this.heroInputRef.current &&
				!checkMobileMQ
			) this.heroInputRef.current.focus()

		if(this.heroInputRef.current) {
			this.heroInputRef.current.addEventListener('click', this._onHeroInputElementClick)
		}

		if(validateURL(this.state.location)) {
			this.submitLocation()
		}

		if(!_.isEmpty(this.state.location)) {
			this._setMobileConvenienceInput(true)
		}

		this.handleGlobalEvents(true)
  }

	componentWillUnmount(): void {
		this.handleGlobalEvents(false)
		if(this.heroInputRef.current) {
			this.heroInputRef.current.removeEventListener('click', this._onHeroInputElementClick)
		}
	}

	private handleGlobalEvents(bind : boolean = true) {
		if(bind) {
			window.addEventListener('keypress', this.onGlobalKeypress)
		} else {
			window.removeEventListener('keypress', this.onGlobalKeypress)
		}
	}

	private onGlobalKeypress(event: KeyboardEvent) {
		console.log('keypress', event)
		if(event.ctrlKey && event.shiftKey && event.code == 'KeyC' ) {
			this.handleGlobalCommand(globalCommands.submitAndCopy)
		}
	}

	componentDidUpdate() {
		if(this.props.extension?.activeTabUrl != this.state.location) 
			this.updateDeferredLocation()

		if(!_.isEmpty(this.state.location))
			this._setMobileConvenienceInput(true)
	}
	// _.once wrapper for update function
	private updateDeferredLocation : () => void

	updateLocation(str: string, isClearPress: boolean = false) {
		console.log(isClearPress)
		this.setState({
			location: str.trim(),
			generatedShortlink: undefined,
			generatedDescriptiveShortlink: undefined,
			generatedHash: undefined,
		})
		if(isClearPress) this._setMobileConvenienceInput(false)
	}

	public async handleGlobalCommand(command: number) {
		console.log('global command:', command)
		switch(command) {
			case globalCommands.submitAndCopy: {
				await this.submitLocation()
				clipboardTools.copy(this.state.generatedShortlink || '')
				return
			}
		}
	}

	private setShortlinkState( args: { location: string, hash: string, userTag?: string, descriptionTag?: string} ) {
		console.log(args)
		let newState: any = {
			generatedShortlink: linkTools.generateShortlinkFromHash(args.hash),
			generatedHash: args.hash,
			location: args.location,
			errorState: {
				createLinkResult: undefined
			}
		}
		if(!_.isEmpty(args.descriptionTag)) {
			newState = {
				...newState,
				userTag: args.userTag,
				descriptionTag: args.descriptionTag,
				generatedDescriptiveShortlink: linkTools.generateDescriptiveShortlink({ userTag: args.userTag, descriptionTag: args.descriptionTag || '' })
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
			const locationUrl = linkTools.fixProtocol(location)
			const result = await Query.createShortlink(locationUrl)
			console.log('[Home] submitLocation\n', result)
			if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${locationUrl}' was not created. Please, try again`)

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
			linkTools.displayServiceUrl+'/',
			{ key: 'userTag', value: this.state.userTag, placeholder: 'user' },
			'@',
			SlugInputSpecialChars.mobileLineBreak,
			{ key: 'descriptionTag', value: this.state.descriptionTag, placeholder: 'your-custom-url' },
		]
	}

	private _clearErrorState(): void {
		this.setState({ errorState: {} })
	}

	private _setMobileConvenienceInput(mode: boolean) {
		console.trace()
		console.log('_setMobileConvenienceInput', checkMobileMQ() && this.state.mobileConvenienceInput != mode)
		if(checkMobileMQ() && this.state.mobileConvenienceInput != mode) {
			this.setState({ mobileConvenienceInput: mode })
		}
	}

	private _onHeroInputElementClick(event: Event) : void {
		console.log(event)
		this._setMobileConvenienceInput(true)
	}

	render() {
		const globalClass = styles.homepage+'_app-body'
		const mobileConvenienceClass = this.state.mobileConvenienceInput ? '__mobile-convenience-state' : ''
		return (
				<div className={`${globalClass}`}>
					<Header />
					<div className={`${globalClass}__layout`}>
						<div className={`${globalClass}__shortlink-block ${mobileConvenienceClass}`}>
							<div className={`${globalClass}__offset-wrapper`}>
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
					</div>
				</div>
		)
	}
}
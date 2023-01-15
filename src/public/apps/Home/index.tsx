/* eslint-disable @typescript-eslint/ban-types */
import styles from './Home.less'
import { checkMobileMQ, modifyURLSlug, validateURL, setCookie, getCookie } from '../../js/utils'
import { HTMLAnyInput, AnyObject } from '../../js/constants'
import { WithRouterProps } from '../../js/router-hoc'

import * as React from 'react'
import * as _ from 'underscore'

import HeroInput from '../../components/hero-input/index'
import ShortlinkDisplay from '../../components/shortlink-display'
import ShortlinkSlugInput, { TextPattern, SlugInputSpecialChars } from '../../components/shortlink-slug-input'
import Snackbar from '../../components/snackbar'

import linkTools from '../../js/url-tools'
import clipboardTools from '../../js/clipboard-tools'

import Query from '../../js/shortlink-queries'
import LSC, {ShortlinkLocalStorage} from '../../js/localstorage-cache'
import GracefulError, { GracefulErrorType } from './errors'

import Header from '../Header'
import { HistoryWidget } from '../History'
import Footer from '../Footer'


const config = require('../../js/config')

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
    lastError?: GracefulErrorType
    createLinkResult?: boolean
    createDescriptiveLinkResult?: boolean
  }
  loadingState: {
    createLinkIsLoading?: boolean
    createDescriptiveLinkIsLoading?: boolean
  }
  mobileConvenienceInput: boolean
  cachedShortlinks: ShortlinkLocalStorage[]
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
      userTag: this.defaultUserTag(),
      descriptionTag: '',
      errorState: {},
      loadingState: {
        createLinkIsLoading: false,
        createDescriptiveLinkIsLoading: false
      },
      mobileConvenienceInput: false,
      cachedShortlinks: []
    }
    this.heroInputRef = React.createRef<HTMLAnyInput>()
    _.bindAll(this, ..._.functions(this))
    this.submitDescriptor = _.debounce(this._submitDescriptor, 500)
  }

  componentDidMount() {
    if(
        this.heroInputRef.current &&
        (!checkMobileMQ || this.props.extension)
      ) this.heroInputRef.current.focus()

    if(validateURL(this.state.location)) {
      this.submitLocation()
    }

    if(!_.isEmpty(this.state.location)) {
      this._setMobileConvenienceInput(true)
    }

    this.handleGlobalEvents(true)

    this.loadAllCachedShortlinks()
  }

  componentWillUnmount(): void {
    this.handleGlobalEvents(false)
  }

  private handleGlobalEvents(bind : boolean = true) {
    if(bind) {
      window.addEventListener('keypress', this.onGlobalKeypress)
    } else {
      window.removeEventListener('keypress', this.onGlobalKeypress)
    }
  }

  private onGlobalKeypress(event: KeyboardEvent) {
    if(event.ctrlKey && event.shiftKey && event.code == 'KeyC' ) {
      this.handleGlobalCommand(globalCommands.submitAndCopy)
    }
  }

  private updateActiveTabUrl = _.once(() => this.setState({ location: this.props.extension?.activeTabUrl || ''}))
  componentDidUpdate() {
    if(this.props.extension && this.props.extension.activeTabUrl != this.state.location) {
      this.updateActiveTabUrl()
    }
  }

  updateLocation(str: string, isClearPress: boolean = false) {
    this._clearErrorState()
    this.setState({
      location: str.trim(),
      generatedShortlink: undefined,
      generatedDescriptiveShortlink: undefined,
      generatedHash: undefined,
      userTag: this.defaultUserTag(),
      descriptionTag: ''
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
      errorState: {}
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
    const locationUrl = linkTools.fixUrl(this.state.location.trim())
    const cachedURL = await LSC.checkShortlinkCache( {url: locationUrl} )
    console.log('cache try', locationUrl, window.localStorage[locationUrl])

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
      url: this.state.location.trim(),
      hash: this.state.generatedHash,
      userTag: this.state.userTag,
      descriptionTag: this.state.descriptionTag
    })
    this.loadAllCachedShortlinks()
  }

  private async loadAllCachedShortlinks() {
    const aMonthAgo = new Date()
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1)
    const result = await LSC.getAll({
      sortByDate: true, 
      clearThreshold: aMonthAgo,
      limit: 3
    })
    if(result) this.setState({
      cachedShortlinks: result
    })
  }

  async submitLocation() {
    this._clearErrorState()

    try {
      const locationUrl = linkTools.fixUrl(this.state.location.trim())
      if (_.isEmpty(locationUrl)) return
      
      const cachedResult = await this.retrieveLSCache()
      if(cachedResult) return

      this.setState({loadingState: {createLinkIsLoading: true}})
      const result = await Query.createShortlink(locationUrl)
      console.log('[Home] submitLocation\n', result)
      if(!result || !result.hash) throw new Error(`Unexpected error: shortlink for '${locationUrl}' was not created. Please, try again`)

      this.setShortlinkState({
        location: result.location,
        hash: result.hash
      })
    } catch (err) {
      this.setState({errorState: {
          lastError: GracefulError.process(err) || undefined,
          createLinkResult: true
        }
      })
      console.error(err) 
    }
    this.setState({loadingState: {createLinkIsLoading: false}})
  }

  handleSuccessPaste(clipText: string) {
    this._clearErrorState()
    this.setState({
      location: clipText
    })
    this.submitLocation()
  }

  handleDescriptorChange(value: string, type: string) {
    this._clearErrorState()
    if(type == 'userTag') this.setState( {userTag: modifyURLSlug(value)} )
    else if(type == 'descriptionTag') this.setState( {descriptionTag: modifyURLSlug(value)} )

    this.setState({loadingState: {createDescriptiveLinkIsLoading: true}})
    this.submitDescriptor()
  }

  public submitDescriptor: (() => void) & _.Cancelable;
  private async _submitDescriptor() {
    this._clearErrorState()
    console.log('[Home] submitDescriptor\n', this.state.userTag, this.state.descriptionTag)

    if(!_.isEmpty(this.state.userTag)) setCookie('userTag', this.state.userTag, 365)

    if(_.isEmpty(this.state.descriptionTag)) { 
      this.setState({
        generatedDescriptiveShortlink: undefined,
        loadingState: {createDescriptiveLinkIsLoading: false}
      })
      return
    }

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
      this.setState({errorState: {
          lastError: GracefulError.process(err) || undefined,
          createDescriptiveLinkResult: true
        }
      })
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

  public defaultUserTag() : string {
    return getCookie('userTag')
  }

  private _setMobileConvenienceInput(mode: boolean) {
    if(checkMobileMQ() && this.state.mobileConvenienceInput != mode) {
      this.setState({ mobileConvenienceInput: mode })
    }
  }

  private _onHeroInputElementFocus(event: Event) : void {
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
                  onFocus={this._onHeroInputElementFocus}
                  hasCta={!this.state.generatedShortlink || this.state.generatedShortlink == ''}
                />
              </div>
              <ShortlinkDisplay
                placeholder={config.displayServiceUrl}
                shortlink={this.state.generatedShortlink}
                isLoading={this.state.loadingState.createLinkIsLoading}
                hasCta={(!!this.state.generatedShortlink || this.state.generatedShortlink != '') && (!this.state.generatedDescriptiveShortlink)}
                error={this.state.errorState.createLinkResult}
              />
              {this.state.generatedShortlink && 
                <ShortlinkSlugInput
                  text={this._generateTextPattern()}
                  onChange={this.handleDescriptorChange}
                  show={this.state.generatedShortlink ? true : false}
                  generatedLink={this.state.generatedDescriptiveShortlink}
                  isLoading={this.state.loadingState.createDescriptiveLinkIsLoading}
                  hasCta={!this.state.generatedDescriptiveShortlink || this.state.generatedDescriptiveShortlink != ''}
                  error={this.state.errorState.createDescriptiveLinkResult}
                />
              }
              <div className={`${globalClass}__snackbar-container`}>
                { this.state.errorState.lastError && 
                  <Snackbar 
                    message={this.state.errorState.lastError.message}
                    canDismiss={true}
                    onDismiss={this._clearErrorState}
                    />
                }
              </div>
            </div>

            <div className={`${globalClass}__footer-wrapper`}>
              <HistoryWidget list={this.state.cachedShortlinks} totalCount={this.state.cachedShortlinks.length} />
            </div>
          </div>
          <Footer />
        </div>
    )
  }
}
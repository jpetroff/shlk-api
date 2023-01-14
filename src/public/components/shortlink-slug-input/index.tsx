import styles from './shortlink-slug-input.less'
import * as _ from 'underscore'
import * as React from 'react'
import Link, { LinkColors } from '../link'
import Button, { ButtonSize, ButtonType } from '../button'
import classNames from 'classnames'

export type TextPattern = {
  key: string
  value: string
  readOnly?: boolean
  placeholder?: string
  lineBreak?: boolean
  mobileLineBreak?: boolean
}

export enum SlugInputSpecialChars {
  mobileLineBreak = '__mobileLineBreak__',
  lineBreak = '__lineBreak__'
}

type Props = {
  text: Array<TextPattern | string>
  onChange: (value: string, type: string) => void
  show?: boolean
  generatedLink?: string
  isLoading?: boolean
  hasCta?: boolean
  error?: boolean
}

export const ShortlinkSlugInput : React.FC<Props> = (
  {
    text,
    onChange,
    show = true,
    isLoading = false,
    generatedLink,
    hasCta = true,
    error = false
  } : Props
) => {

  const globalClass = styles.wrapperClass+'_slug-input'
  const slugInputClasses = classNames({
    [`${globalClass}`]: true,
    [`${globalClass}_error`]: error,
    [`${globalClass}_hide`]: !show
  })
  const activeActionWrapperClass = !_.isEmpty(generatedLink) ? globalClass+'__action-wrapper_has-shortlink' : ''

  let linkLabel : string = 'Copy custom shortlink'
  if(_.isEmpty(generatedLink)) linkLabel = ''
  if(isLoading) linkLabel = 'Loading'

  let btnLabel : string = 'Copy'
  if(isLoading) linkLabel = 'Loading'


  function handleCopy () {
    if(_.isFunction(navigator.clipboard.writeText) && generatedLink) {
      navigator.clipboard.writeText(generatedLink)
    } 
  }

  return (
    <div className={`${slugInputClasses}`}>
      <div className={`${globalClass}__label`}>Make a custom link</div>
      <div className={`${globalClass}__content-wrapper`}>
        <div className={`${globalClass}__action-wrapper ${activeActionWrapperClass}`} 
        onClick={handleCopy}
      >
        <div className={`${globalClass}__constructed-input`}>
          {text.map((chunk: TextPattern | string, index ) => {
              if (_.isString(chunk)) {
                switch(chunk) {
                  case SlugInputSpecialChars.mobileLineBreak : 
                    return (<br key={index} className={`${globalClass}__mlbr`} />)
                  case SlugInputSpecialChars.lineBreak : 
                    return (<br key={index} className={`${globalClass}__lbr`} />)
                  default : 
                    return (<span key={index} className={`${globalClass}_text-filler ${globalClass}__input-common-style`}>{chunk}</span>)
                }
              } else {
                return (
                  <span key={index} className={`${globalClass}__input-resizable`}>
                    <input 
                      className={`${globalClass}__input-resizable__real-input ${globalClass}__input-common-style`}
                      value={chunk.value}
                      onChange={(event) => {onChange(event.target.value, chunk.key)}}
                    />
                    <span className={`${globalClass}__input-resizable__width-sizer ${globalClass}__input-common-style ${globalClass}__input-resizable__width-sizer_${chunk.value ? 'hide' : 'show'}`}>{chunk.value || chunk.placeholder}</span>
                  </span>	
                )
              }
            })
          }
        </div>
        <Link 
            href='#'
            className={`${globalClass}__copy_pseudolink`}
            colorScheme={LinkColors.APP}
            isDisabled={_.isEmpty(generatedLink) || error}
            isLoading={isLoading}
            label={linkLabel}
            flyover='Copied!'
            />
        </div>
        {
          (isLoading || !_.isEmpty(generatedLink)) &&
          <Button
            className={`${globalClass}__copy_button`}
            label={btnLabel}
            size={ButtonSize.LARGE}
            type={hasCta ? ButtonType.PRIMARY : ButtonType.SECONDARY}
            isDisabled={_.isEmpty(generatedLink) || error}
            isLoading={isLoading}
            onClick={handleCopy}
            flyover='Copied!'
            />
        }
      </div>
    </div>
  )

}

export default ShortlinkSlugInput
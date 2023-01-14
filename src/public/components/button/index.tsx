import styles from './button.less'
import * as React from 'react'
import * as _ from 'underscore'
import { Flyover } from '../tooltip'

import Icon, { ReactIcon, IconSize, CaretRight } from '../icons'
import { useState } from 'react'

export enum ButtonSize {
  LARGE = 'large',
  SMALL = 'small'
}

export enum ButtonType {
  PRIMARY = 'primary',
  GHOST = 'ghost',
  SECONDARY = 'secondary'
}

type Props = {
  label?: string
  icon?: ReactIcon
  size: ButtonSize
  type: ButtonType
  onClick?: React.ReactEventHandler<HTMLAnchorElement>
  isDisabled?: boolean
  isLoading?: boolean
  isCaret?: boolean
  flyover?: string
  tooltip?: TooltipProps
} & JSX.IntrinsicElements["a"]

const BtnIcnMap = _.object(
  [ButtonSize.LARGE,	ButtonSize.SMALL,	],
  [IconSize.LARGE,		IconSize.SMALL,		]
)

const Button : React.FC<Props> = function(
  args : Props
) {
  const [showFlyover, setShowFlyover] = useState(false)
  const globalClass = styles.wrapperClass+'_button'

  let buttonClassMods : Array<string> = []
  buttonClassMods.push(globalClass + '_' + args.size)
  buttonClassMods.push(globalClass + '_' + args.type)
  if(args.isDisabled || args.isLoading) buttonClassMods.push(globalClass+'_disabled')
  if(args.isLoading) buttonClassMods.push(globalClass+'_loading')
  if(!args.label && args.icon) buttonClassMods.push(globalClass+'_icon-only')

  const htmlAnchorProps = _.omit(args, 'size', 'type', 'isDisabled', 'isCaret', 'label', 'icon', 'isLoading', 'onClick')

  const handleClick : (event: React.MouseEvent<HTMLAnchorElement>) => void = (event) => {
    if(args.isDisabled || args.isLoading) {
      event.preventDefault()
      event.stopPropagation()
      return;
    } 

    if(_.isFunction(args.onClick)) {
      // _.delay(() => args.onClick(event), 100)
      args.onClick(event)
    }

    if(args.flyover) setShowFlyover(true)
  }

  return (
    <a {...htmlAnchorProps} 
      className={`${args.className || ''} ${globalClass} ${buttonClassMods.join(' ')}`}
      onClick={handleClick}
    >
        {args.icon && 
          <Icon 
            className={`${globalClass}__icon`}
            useIcon={args.icon} 
            size={BtnIcnMap[args.size] || IconSize.SMALL} />
        }
        {args.label && 
          <span 
            className={`${globalClass}__label`} >
            {args.label}
          </span>
        }
        {args.isCaret &&
          <Icon useIcon={CaretRight} size={IconSize.SMALL}/>
        }
        {args.flyover && showFlyover && <Flyover label={args.flyover} onDone={() => setShowFlyover(false)} />}
    </a>
  )
}

export default Button
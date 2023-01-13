import styles from './link.less'
import * as React from 'react'
import * as _ from 'underscore'
import Icon, { ReactIcon, IconSize } from '../icons'
import classNames from 'classnames'
import { Flyover } from '../tooltip'

export enum LinkColors {
  USER = 'user',
  APP = 'app'
}

type Props = {
  colorScheme?: LinkColors
  label?: string
  icon?: ReactIcon
  iconSize?: IconSize
  iconRight?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  flyover?: string
  tooltip?: TooltipProps
} & JSX.IntrinsicElements['a']

const Link : React.FC<Props> = (
 args: Props
) => {
  const [showFlyover, setShowFlyover] = React.useState(false)

  const globalClass = styles.wrapperClass+'_link'
  const linkClasses = classNames({
    [`${globalClass}`]: true,
    [`${globalClass}_${args.colorScheme}`]: true,
    [`${globalClass}_loading`]: args.isLoading,
    [`${globalClass}_disabled`]: args.isDisabled || args.isLoading
  })

  const handleClick : (event: React.MouseEvent<HTMLAnchorElement>) => void = (event) => {
    if(args.isDisabled || args.isLoading) {
      event.preventDefault()
      event.stopPropagation()
      return;
    } 

    if(_.isFunction(args.onClick)) {
      args.onClick(event)
    }

    if(args.flyover) setShowFlyover(true)
  }

  const htmlAnchorAttributes = _.omit(args, 'colorScheme', 'label', 'icon', 'iconSize', 'isDisabled', 'iconRight', 'isLoading', 'flyover', 'tooltip', 'onClick')
  return (
    <a {...htmlAnchorAttributes}
      className={`${linkClasses} ${args.className || ''}`}
      onClick={handleClick}
    >
      {args.icon && !args.iconRight && 
        <Icon useIcon={args.icon} size={args.iconSize || IconSize.SMALL} />
      }

      {args.label}{args.children}

      {args.icon && args.iconRight && 
        <Icon useIcon={args.icon} size={args.iconSize || IconSize.SMALL} />
      }

      {args.flyover && showFlyover && <Flyover label={args.flyover} onDone={() => setShowFlyover(false)} />}
    </a>
  )
}

Link.defaultProps = {
  isDisabled: false,
  isLoading: false, 
  colorScheme: LinkColors.APP
}

export default Link
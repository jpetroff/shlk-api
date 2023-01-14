import styles from './History.less'
import * as React from 'react'
import * as _ from 'underscore'
import {ShortlinkLocalStorage} from '../../js/localstorage-cache'
import clipboardTools from '../../js/clipboard-tools'
import Link, { LinkColors } from '../../components/link'
import LinkTools from '../../js/url-tools'
import classNames from 'classnames'

type Props = {
  list: ShortlinkLocalStorage[]
}

enum ActionLabels {
  copy = 'Copy',
  copied = 'Copied!',
  open = 'Open'
}

const HistoryWidget : React.FC<Props> = (
  {
    list
  } : Props
) => {
  const globalClass = styles.widgetWrapper+'_history-widget'
  const widgetClasses = classNames({
    [`${globalClass}`]: true
  })
  const [activeKey, setActiveKey] = React.useState<number | null>(null)

  const handleClick = (url: string, key: number, event?: React.MouseEvent) => {
    if(clipboardTools.enabled) clipboardTools.copy(url)
    setActiveKey(key) 
  }

  React.useEffect( () => {
    if(activeKey == null) return 
    const timeout = setTimeout( () => { setActiveKey(null) }, parseInt(styles.swapDuration))

    return () => { clearTimeout(timeout)}
  }, [activeKey])

  return (
    <div 
      className={`${widgetClasses}`}
    >	
      <div className={`${globalClass}__header`}>Last created shortlinks</div>
      <div className={`${globalClass}__link-list`}>
        {list.map( (item: ShortlinkLocalStorage, key: number) => {
          if(!item.hash) return null
          const shortlink = item.descriptionTag && item.descriptionTag != '' ? 
                            LinkTools.generateDescriptiveShortlink( { userTag: item.userTag, descriptionTag: item.descriptionTag } ) :
                            LinkTools.generateShortlinkFromHash(item.hash)

          const displayShortlink = shortlink.replace(/https?:\/\//ig, '')
          const url = item.url
          const displayUrl = item.url.replace(/https?:\/\//ig, '')

          
          return (
          <div 
            className={`${globalClass}__link-block`} 
            key={key}
            >
            <Link 
              onClick={(event) => handleClick(shortlink, key, event)}
              className={`${globalClass}__shortlink ${activeKey == key ? globalClass+'__shortlink_anim-active' : ''}`} 
              label={displayShortlink}>
              <span className={`${globalClass}__separator`} >·</span>
              <span className={`${globalClass}__action-hint`}>
                <span className={`${globalClass}__action-hint__animated-inner`}>
                  {ActionLabels.copy}<br/>
                  {ActionLabels.copied}
                </span>
              </span>
            </Link>
            <Link  
              className={`${globalClass}__full-link`} 
              href={url}
              colorScheme={LinkColors.USER}>
                <span className={`${globalClass}__full-link__span`}>{displayUrl}</span>
                <span className={`${globalClass}__separator`} >·</span>
                <span className={`${globalClass}__action-hint`}>{ActionLabels.open}</span>
            </Link>
          </div>) 
        })}
      </div>
    </div>
  )
}

export default HistoryWidget
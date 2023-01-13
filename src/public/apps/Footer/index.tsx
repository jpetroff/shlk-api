import styles from './footer.less'
import * as React from 'react'
import Flag from '../../assets/svg/flag_fi_16.svg'
import Heart from '../../assets/svg/w_love_14.svg'
import Link from '../../components/link'

const Footer : React.FC<{}> = () => {
  const globalClass = styles.wrapperClass+'_footer'
  return (
    <div className={`${globalClass}__wrapper`}>
      <div className={`${globalClass}`} >
        <div className={`${globalClass}__item`}>
          <Flag className={`${globalClass}__flag-icon`} />
          <span>Valmistettu Suomessa</span>
        </div>
        <div className={`${globalClass}__item`}>
          Personal project made by <Link href="https://portfolio.designpr.one">designpr.one</Link>
        </div>
        <div className={`${globalClass}__item`}>
          <span>Pangram Pangram•Foundry© × Mori typeface =</span>
          <Heart className={`${globalClass}__with-love-icon`} />
        </div>
      </div>
    </div>
  )
}

export default Footer


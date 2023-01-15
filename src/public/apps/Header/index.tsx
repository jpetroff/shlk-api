import styles from './Header.less'
import * as React from 'react'

import Icon, { Logo, LogoC, Avatar, IconSize } from '../../components/icons'
import { checkMobileMQ } from '../../js/utils'

import Link from '../../components/link'


type Props = {}

type State = {}

const Header : React.FC<Props> = (

) => {
	const isMobile: boolean = checkMobileMQ()

  const globalClass = `${styles.wrapperClass}_app-header`

  return (
    <div className={`${globalClass}`}>
      <div className={`${globalClass}__logo-wrapper`}>
        <Logo className={`${globalClass}__logo ${globalClass}__logo_d`} />
        <LogoC className={`${globalClass}__logo ${globalClass}__logo_m`} />
      </div>
      <div className={`${globalClass}__middle`}></div>
      <div className={`${globalClass}__user`}>
        <Link className={`${globalClass}__account-link`} isDisabled={true}
        >
          <div className={`${globalClass}__account-link__avatar`}><Icon useIcon={Avatar} size={IconSize.LARGE} /></div>
          <div className={`${globalClass}__account-link__text`}>Sign in</div>
        </Link>
      </div>
    </div>
  )
}

export default Header
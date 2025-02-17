import i18n from '@dhis2/d2-i18n'
import { CssVariables, CssReset, Menu, MenuItem } from '@dhis2/ui'
import { Fragment, useEffect } from 'react'
import { Outlet, useResolvedPath, useNavigate } from 'react-router-dom'
import useAppSettings from '../hooks/useAppSettings.js'
import CheckOrgUnitTree from './check/OrgUnitTree.jsx'
import OrgUnitTree from './explore/OrgUnitTree.jsx'
import styles from './styles/Root.module.css'

export const appPages = [
    { path: '/', name: i18n.t('Home') },
    { path: '/explore', name: i18n.t('Explore data') },
    { path: '/station', name: i18n.t('Station data') },
    { path: '/import', name: i18n.t('Import data') },
    { path: '/setup', name: i18n.t('Setup guide') },
    { path: '/settings', name: i18n.t('Settings') },
]

const Root = () => {
    const { settings } = useAppSettings()
    const { pathname } = useResolvedPath()
    const navigate = useNavigate()

    useEffect(() => {
        if (pathname === '/' && settings?.startPage) {
            navigate(settings.startPage)
        }
    }, [settings, pathname, navigate])

    return (
        <>
            <CssReset />
            <CssVariables spacers colors />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Menu>
                        {appPages.map(({ path, name }) => (
                            <Fragment key={path}>
                                <MenuItem
                                    label={name}
                                    href={`#${path}`}
                                    active={
                                        pathname === path ||
                                        (path !== '/' &&
                                            pathname.startsWith(path))
                                    }
                                />
                                {path === '/explore' &&
                                    pathname.startsWith('/explore') && (
                                        <OrgUnitTree />
                                    )}
                            </Fragment>
                        ))}
                        {pathname.startsWith('/check') && (
                            <>
                                <MenuItem
                                    label={i18n.t('Check data')}
                                    active={true}
                                />
                                <CheckOrgUnitTree />
                            </>
                        )}
                    </Menu>
                </div>
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Root

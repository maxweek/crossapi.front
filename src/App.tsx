import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './css/styles.scss';
import Sidebar from './components/sidebar/sidebar';
import LoginPage from './pages/loginPage';
import IndexPage from './pages/indexPage';
import AppStore from './store/store';
import { observer } from 'mobx-react-lite';
import Tables_Page from './pages/tablesPage';
import Header from './components/header/header';
import { apiRequest, checkToken, setRequest, setRequestList } from './API';
import { getCl, getCookie, setCookie } from './helper';
// import Notif from './components/notif/notif';
// import NotifStore from './store/_notifStore';
import Themer from './components/themer';
import Table_Page from './pages/tablePage';
import Table_Add_Page from './pages/tableAddPage';
import Table_Edit_Page from './pages/tableEditPage';
import Tables_Add_Page from './pages/tablesAddPage';
import Tables_Edit_Page from './pages/tablesEditPage';
import TypesPage from './pages/typesPage';
import Statiks_Page from './pages/statiksPage';
import Statiks_Add_Page from './pages/statikAddPage';
import Statiks_Edit_Page from './pages/statikEditPage';

const App = observer(() => {
  const [inited, setInited] = useState<boolean>(true);

  useEffect(() => {
    setRequest({
      type: 'GET',
      url: '/core/types/',
      success: (res) => {
        console.log(res)
        AppStore.setTypes(res)
        // setInited(true)
      },
    })

    setRequest({
      type: 'GET',
      url: '/core/static/',
      success: (res) => {
        AppStore.setStatiks(res)
      },
    })
    setRequest({
      type: 'GET',
      url: '/core/tables/',
      success: (res) => {
        console.log(res)
        AppStore.setTables(res)
        setInited(true)
      },
    })
  }, [])

  return (
    <div id="__site_wrapper" className={`App ${getCl(!AppStore.isLogged, 'otlg')} ${getCl(inited, 'inited')}`}>
      {/* <Auth_Worker setInited={setInited} /> */}
      {/* <Notif /> */}
      <Themer />
      {!inited ? <></> :
        !AppStore.isLogged ?
          <main>
            <Routes>
              <Route path='/auth' element={<LoginPage />} />
            </Routes>
          </main>
          :
          <>
            <Header />
            <Sidebar items={[
              {
                link: '/tables/',
                text: 'Таблицы',
                icon: 'activity',
                // childs: [
                //   {
                //     link: '/tables/',
                //     text: 'Таблицы',
                //   }
                // ]
                childs: AppStore.tables.map(table => {
                  return {
                    link: `/tables/table/${table.id}/`,
                    text: table.name
                  }
                })
              },
              {
                link: '/static/',
                text: 'Статика',
                icon: 'activity',
                // childs: [
                //   {
                //     link: '/tables/',
                //     text: 'Таблицы',
                //   }
                // ]
                childs: AppStore.statiks.map(statik => {
                  return {
                    link: `/static/${statik.id}/`,
                    text: statik.name
                  }
                })
              },
              {
                link: '/types',
                text: 'Типы',
                icon: 'server',
              },
              {
                link: '/media',
                text: 'Медиа',
                icon: 'server',
              },
              {
                link: '/settings',
                text: 'Настройки',
                icon: 'server',
              },
            ]} />
            <main>
              <Routes>
                <Route path='/' element={<IndexPage />} />
                <Route path='/types' element={<TypesPage />} />
                <Route path='/tables'>
                  <Route index element={<Tables_Page />} />
                  <Route path='add' element={<Tables_Add_Page />} />
                  <Route path=':id' element={<Tables_Edit_Page />} />
                  <Route path='table/:id' element={<Table_Page />} />
                  <Route path='table/:id/add' element={<Table_Add_Page />} />
                  <Route path='table/:id/:itemId' element={<Table_Edit_Page />} />
                </Route>
                <Route path='/static'>
                  <Route index element={<Statiks_Page />} />
                  <Route path='add' element={<Statiks_Add_Page />} />
                  <Route path=':id' element={<Statiks_Edit_Page />} />
                </Route>
                {/* <Route path='/places'>
                  <Route index element={<Places_List_Page />} />
                  <Route path='add' element={<Places_Add_Page />} />
                  <Route path=':id' element={<Places_Edit_Page />} />
                </Route> */}
              </Routes>
            </main>
          </>
      }
    </div>
  );
})

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}


interface AuthWorkerProps {
  setInited: (value: boolean) => void
}

const Auth_Worker: FC<AuthWorkerProps> = (props: AuthWorkerProps) => {
  const navigate = useNavigate();
  const [tokenInited, setTokenInited] = useState<boolean>(false)
  const location = useLocation();

  useEffect(() => {
    console.log('TEST RECONN', tokenInited)
    if (!tokenInited) {
      checkToken(() => {
        setTokenInited(true)
      }, () => {
        setRequestList({
          requests: [
            {
              type: "GET",
              url: '/properties/',
              success: (payload) => {
                // AppStore.setProperties(payload.data)
              },
            },
            {
              type: "GET",
              url: '/profile/',
              success: (payload) => {
                AppStore.setUser(payload.data)
              },
            },
          ],
          successList: () => {
            props.setInited(true)
          },
          errorList: () => {
            props.setInited(false)
          }
        })
      }, () => {
        props.setInited(true)
      });
    }
    if (tokenInited) {
      if (!AppStore.isLogged) {
        navigate('/auth')
      }
      if (AppStore.isLogged) {
        if (location.pathname.includes('auth') || location.pathname === '/') {
          setTokenInited(false)
          props.setInited(false)
          navigate('/dashboard')
        }
      }
    }
  }, [AppStore.isLogged, tokenInited])

  return (
    <></>
  )
}

export default AppWrapper;

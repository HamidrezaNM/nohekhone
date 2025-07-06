import './assets/styles/Material Symbol Rounded.css'
import "./App.css";
import Topbar from "./Components/Topbar";
import './Mobile.css';
import { createContext, useEffect, useState } from 'react';
import Home from './Components/Home';
import AddNohe from './Components/AddNohe';
import Player from './Components/Player';
import Drawer from './Components/Drawer';
import axios from 'axios';
import buildClassName, { isMobile } from './util';
import Transition from './Components/Transition';

export const Ctx = createContext()

function App() {
  const [madahes, setMadahes] = useState([])
  const [nohes, setNohes] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [activeNohe, setActiveNohe] = useState()
  const [homeActiveNohe, setHomeActiveNohe] = useState()
  const [selectedMadah, setSelectedMadah] = useState()
  const [selectedNohes, setSelectedNohes] = useState([])
  const [activePage, setActivePage] = useState("Home")
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)

  const myNohes = {
    _id: 0,
    name: "نوحه های من",
    profile: ''
  }

  useEffect(() => {
    var _madahes = localStorage.getItem('madahes')
    var _nohes = localStorage.getItem('nohes')
    var _myNohes = localStorage.getItem('myNohes')
    if (_madahes !== null) {
      _madahes = JSON.parse(_madahes)
      setMadahes([myNohes, ..._madahes])
    }
    if (_myNohes !== null) {
      _myNohes = JSON.parse(_myNohes)
    } else {
      localStorage.setItem('myNohes', '[]')
      _myNohes = []
    }
    if (_nohes !== null) {
      _nohes = JSON.parse(_nohes)
      for (let i = 0; i < _nohes.length; i++) {
        const item = _nohes[i];

        _madahes.forEach((madah) => {
          if (item.madah === madah._id) {
            _nohes[i].madah = madah
            madah.noheCount ? madah.noheCount++ : madah.noheCount = 1
          }
        })
      }
      setNohes(_nohes)
      setTimeout(() => { setSelectedNohes(_nohes) }, 10)
      setPlaylist(_nohes)
    }

    axios(
      {
        method: 'post',
        url: "https://nohekhonebot.onrender.com/",
        data: { method: 'getMadahes' },
        headers: { "content-type": "application/json" },
      },
    )
      .then((response) => {
        var _madahes = [];
        _madahes = response.data.data.data

        localStorage.setItem('madahes', JSON.stringify(_madahes))
        _madahes = [myNohes, ..._madahes]

        setMadahes(_madahes)
        axios(
          {
            method: 'post',
            url: "https://nohekhonebot.onrender.com/",
            data: { method: 'getNohes' },
            headers: { "content-type": "application/json" },
          },
        )
          .then((res) => {
            const data = res.data.data.data

            var _nohes = [];
            _nohes = data

            for (let i = 0; i < _nohes.length; i++) {
              const item = _nohes[i];

              _myNohes.forEach(_nohe => {
                if (item.title === _nohe.title) {
                  _nohe.approved = true
                }
              })

              _madahes.forEach((madah) => {
                if (item.madah === madah._id) {
                  _nohes[i].madah = madah
                  madah.noheCount ? madah.noheCount++ : madah.noheCount = 1
                }
              })
            }

            _madahes[0].noheCount = _myNohes.length

            setNohes([..._nohes, ..._myNohes])
            setSelectedNohes([..._nohes, ..._myNohes])
            setPlaylist([..._nohes, ..._myNohes])
            localStorage.setItem('nohes', JSON.stringify(_nohes))
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

  }, [])

  useEffect(() => {
    if (selectedMadah) {
      setSelectedNohes([])

      for (let i = 0; i < nohes.length; i++) {
        const item = nohes[i];

        if (item.madah._id === selectedMadah._id) {
          setSelectedNohes((current) => [...current, item])
        }
      }
    } else {
      setSelectedNohes(nohes)
    }
  }, [selectedMadah])

  useEffect(() => {
    if (activeNohe?.title) {
      document.title = 'نوحه خونه | ' + activeNohe.title
    } else {
      document.title = 'نوحه خونه'
    }
  }, [activeNohe])

  return (
    <div className="App">
      <Ctx.Provider value={{
        madahes,
        setMadahes,
        nohes,
        setNohes,
        playlist,
        setPlaylist,
        selectedNohes,
        selectedMadah,
        setSelectedMadah,
        activeNohe,
        setActiveNohe,
        homeActiveNohe,
        setHomeActiveNohe,
        activePage,
        setActivePage,
        showPlayer,
        setShowPlayer,
        showDrawer,
        setShowDrawer
      }}>
        <Topbar />
        <div className='Columns'>
          <Drawer />
          <div className='Primary scrollable'>
            {activePage === 'Home'
              ? <Home />
              : <AddNohe setNohes={setNohes} />
            }
          </div>
          {activeNohe &&
            <Transition state={isMobile ? showPlayer : true}>
              <div className={buildClassName('Secondary', 'scrollable', showPlayer && 'focused', isMobile && 'animatee')}>
                <Player />
              </div>
            </Transition>
          }
        </div>
      </Ctx.Provider>
    </div>
  );
}

export default App;

import './assets/styles/Material Symbol Rounded.css'
import "./App.css";
import Topbar from "./Components/Topbar";
import './Mobile.css';
import { createContext, useEffect, useState } from 'react';
import Card from './Components/Card';
import Home from './Components/Home';
import AddNohe from './Components/AddNohe';
import Player from './Components/Player';
import Drawer from './Components/Drawer';
import axios from 'axios';

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

  useEffect(() => {
    var _madahes = localStorage.getItem('madahes')
    var _nohes = localStorage.getItem('nohes')
    if (_madahes !== null) {
      _madahes = JSON.parse(_madahes)
      setMadahes(_madahes)
    }
    if (_nohes !== null) {
      _nohes = JSON.parse(_nohes)
      for (let i = 0; i < _nohes.length; i++) {
        const item = _nohes[i];

        _madahes.forEach((madah) => {
          if (item.madah == madah._id) {
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
        url: "http://localhost:4000",
        data: { method: 'getMadahes' },
        headers: { "content-type": "application/json" },
      },
    )
      .then((response) => {
        var _madahes = [];
        _madahes = response.data.data.data

        localStorage.setItem('madahes', JSON.stringify(_madahes))
        setMadahes(_madahes)
        axios(
          {
            method: 'post',
            url: "http://localhost:4000",
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

              _madahes.forEach((madah) => {
                if (item.madah == madah._id) {
                  _nohes[i].madah = madah
                  madah.noheCount ? madah.noheCount++ : madah.noheCount = 1
                }
              })
            }

            setNohes(_nohes)
            setSelectedNohes(_nohes)
            setPlaylist(_nohes)
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

        if (item.madah._id == selectedMadah._id) {
          setSelectedNohes((current) => [...current, item])
        }
      }
    } else {
      setSelectedNohes(nohes)
    }
  }, [selectedMadah])

  return (
    <div className="App">
      <Ctx.Provider value={{ madahes, setMadahes, nohes, setNohes, playlist, setPlaylist, selectedNohes, selectedMadah, setSelectedMadah, activeNohe, setActiveNohe, homeActiveNohe, setHomeActiveNohe, activePage, setActivePage }}>
        <Topbar />
        <div className='Columns'>
          <Drawer />
          <div className='Primary scrollable'>
            {activePage == 'Home'
              ? <Home />
              : <AddNohe />
            }
          </div>
          {activeNohe && <div className='Secondary'>
            <Player />
          </div>}
        </div>
      </Ctx.Provider>
    </div>
  );
}

export default App;

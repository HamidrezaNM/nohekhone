import './assets/styles/Material Symbol Rounded.css'
import "./App.css";
import Topbar from "./Components/Topbar";
import './Mobile.css';
import { createContext, useEffect, useState } from 'react';
import Card from './Components/Card';
import Player from './Components/Player';
import axios from 'axios';

export const Ctx = createContext()

function App() {
  const [madahes, setMadahes] = useState([])
  const [nohes, setNohes] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [activeNohe, setActiveNohe] = useState()
  const [selectedMadah, setSelectedMadah] = useState()
  const [selectedNohes, setSelectedNohes] = useState([])

  useEffect(() => {
    axios
      .post(
        "https://nohekhoneapi.hmdnjf.repl.co/api/",
        {
          method: "getMadahes",
        }
      )
      .then((response) => {
        setMadahes(response.data)
        axios
          .post(
            "https://nohekhoneapi.hmdnjf.repl.co/api/",
            {
              method: "getNohes",
            }
          )
          .then((res) => {
            const data = res.data

            for (let i = 0; i < data.length; i++) {
              const item = data[i];

              response.data.forEach((madah) => {
                if (item.madah == madah.id) {
                  data[i].madah = madah
                  madah.noheCount ? madah.noheCount++ : madah.noheCount = 1
                }
              })
            }

            setNohes(data)
            setSelectedNohes(data)
            setPlaylist(data)
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

        if (item.madah.id == selectedMadah.id) {
          setSelectedNohes((current) => [...current, item])
        }
      }
    } else {
      setSelectedNohes(nohes)
    }
  }, [selectedMadah])

  return (
    <div className="App">
      <Ctx.Provider value={{ madahes, setMadahes, nohes, setNohes, playlist, setPlaylist, selectedNohes, activeNohe, setActiveNohe }}>
        <Topbar />
        <div className='Columns'>
          <div className='Primary scrollable'>
            <div className={'Cards Madahan' + (selectedMadah ? ' Selected' : '')}>
              {madahes.map((item) => {
                return <Card image={item.profile} title={item.name} subtitle={(item.noheCount ?? 0) + ' نوحه'} onClick={(e) => { if (selectedMadah) { setSelectedMadah(); e.target.closest('.Card').classList.remove('active') } else { setSelectedMadah(item); e.target.closest('.Card').classList.add('active') } }} />
              })}
            </div>
            <div className='Items Noheha'>
              {selectedNohes.map((item) => {
                return <div className='item' onClick={() => {
                  setPlaylist(selectedNohes)
                  setActiveNohe(item); setTimeout(() => {
                    document.querySelector('.Secondary').style = '';
                    document.querySelector('.Topbar .back.icon').style = ''
                  }, 0);
                }}>
                  <div className='meta image'><img src={'https://nohekhoneapi.hmdnjf.repl.co/images/Noheha/' + item.image} /></div>
                  <div className='body'>
                    <div className='title'>{item.title}</div>
                    <div className='subtitle'>{item.madah.name}</div>
                  </div>
                </div>
              })}
            </div>
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

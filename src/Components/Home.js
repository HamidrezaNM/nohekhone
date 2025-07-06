import { useContext, useEffect } from "react"
import Card from './Card';
import { Ctx } from "../App"
import { isMobile, toFarsiNumber } from "../util";
import MiniPlayer from "./MiniPlayer";

export default function Home() {
  const { homeActiveNohe,
    setHomeActiveNohe,
    activeNohe,
    setActiveNohe,
    selectedMadah,
    setSelectedMadah,
    selectedNohes,
    madahes,
    setPlaylist,
    showPlayer,
    setShowPlayer
  } = useContext(Ctx)

  useEffect(() => {
    if (homeActiveNohe) {
      console.log(homeActiveNohe)
      setActiveNohe(homeActiveNohe);
    }
  }, [])

  return <>
    <div className={'Cards Madahan' + (selectedMadah ? ' Selected' : '')}>
      {madahes.map((item) => {
        return <Card key={item._id} className={item._id === selectedMadah?._id ? 'active' : ''} image={item.profile} title={item.name} subtitle={toFarsiNumber(item.noheCount ?? 0) + ' نوحه'} onClick={(e) => { if (selectedMadah) { setSelectedMadah(); e.target.closest('.Card').classList.remove('active') } else { setSelectedMadah(item); e.target.closest('.Card').classList.add('active') } }} />
      })}
    </div>
    <div className='Items Noheha'>
      {selectedNohes.map((item) =>
        <div key={item._id + item.title} className='item' onClick={() => {
          setPlaylist(selectedNohes)
          setHomeActiveNohe(item);
          setActiveNohe(item);
          setShowPlayer(true)
        }}>
          <div className='meta image'><img src={item.image ?? 'no-image'} onError={(e) => e.target.style.opacity = 0} /></div>
          <div className='body'>
            <div className='title'>{item.title}</div>
            <div className='subtitle'>{item.madah.name}</div>
          </div>
          <div className={"right" + (item.approved ? ' green' : '')}>{item._id === 0 && (!item.approved ? 'درانتظار تایید' : 'تایید شده')}</div>
        </div>
      )}
    </div>
    {isMobile && <MiniPlayer />}
  </>
}
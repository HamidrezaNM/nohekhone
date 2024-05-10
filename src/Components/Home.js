import { useContext, useEffect } from "react"
import Card from './Card';
import { Ctx } from "../App"

export default function Home() {  
  const Context = useContext(Ctx)

  useEffect(() => {
    if(Context.homeActiveNohe) {
      console.log(Context.homeActiveNohe)
      Context.setActiveNohe(Context.homeActiveNohe);
    }
  }, [])
  
  return <>
    <div className={'Cards Madahan' + (Context.selectedMadah ? ' Selected' : '')}>
      {Context.madahes.map((item) => {
        return <Card image={item.profile} title={item.name} subtitle={(item.noheCount ?? 0) + ' نوحه'} onClick={(e) => { if (Context.selectedMadah) { Context.setSelectedMadah(); e.target.closest('.Card').classList.remove('active') } else { Context.setSelectedMadah(item); e.target.closest('.Card').classList.add('active') } }} />
      })}
    </div>
    <div className='Items Noheha'>
      {Context.selectedNohes.map((item) => {
        return <div className='item' onClick={() => {
          Context.setPlaylist(Context.selectedNohes)
          Context.setHomeActiveNohe(item);
          Context.setActiveNohe(item); setTimeout(() => {
            document.querySelector('.Secondary').style = '';
            document.querySelector('.Topbar .back.icon').style = ''
          }, 0);
        }}>
          <div className='meta image'><img src={item.image} /></div>
          <div className='body'>
            <div className='title'>{item.title}</div>
            <div className='subtitle'>{item.madah.name}</div>
          </div>
        </div>
      })}
    </div>
  </>
}
import { useContext, useEffect } from "react"
import { Ctx } from "../App"

export default function Topbar() {
    const Context = useContext(Ctx)

    useEffect(() => {
        document.body.classList.add('Dark')
    }, [])

    useEffect(() => {
        if (document.body.clientWidth <= 600 && Context.activeNohe) {
            document.querySelector('.Secondary').style = ''
            document.querySelector('.Topbar .menu.icon').style.display = 'none'
            document.querySelector('.Topbar .back.icon').style = ''
        }
    }, [Context.activeNohe])

    return <div className="Topbar">
        <div className="menu icon">menu</div>
        {Context.activeNohe && <div className="back icon" onClick={() => { document.querySelector('.Secondary').style.display = 'none'; document.querySelector('.Topbar .menu.icon').style = ''; document.querySelector('.Topbar .back.icon').style.display = 'none' }}>arrow_back</div>
        }
        <div className="app-name">نوحه خونه</div>
        <div className="icon close" onClick={() => Context.setActiveNohe()}>{Context.activeNohe && 'close'}</div>
    </div >
}
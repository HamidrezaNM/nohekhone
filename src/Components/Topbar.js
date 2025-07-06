import { useContext, useEffect } from "react"
import { Ctx } from "../App"
import { isMobile } from "../util"

export default function Topbar() {
    const { activeNohe, setActiveNohe, showPlayer, setShowPlayer, showDrawer, setShowDrawer } = useContext(Ctx)

    useEffect(() => {
        document.body.classList.add('Dark')
    }, [])

    // useEffect(() => {
    //     if (document.body.clientWidth <= 600 && activeNohe) {
    //         document.querySelector('.Secondary').style = ''
    //     }
    // }, [activeNohe])

    return <div className="Topbar">
        {(showPlayer && isMobile) ?
            <div className="back icon"
                onClick={() => setShowPlayer(false)}
            >arrow_back</div> :
            <div className="menu icon" onClick={() => setShowDrawer(!showDrawer)}>menu</div>}
        <div className="app-name">نوحه خونه</div>
        <div className="icon close" onClick={() => { setActiveNohe(); setShowPlayer(false) }}>{activeNohe && 'close'}</div>
    </div >
}
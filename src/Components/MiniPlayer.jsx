import { memo, useContext } from "react"
import { Ctx } from "../App"
import Transition from "./Transition"

function MiniPlayer({ }) {
    const { activeNohe, showPlayer, setShowPlayer } = useContext(Ctx)

    return <Transition state={!!activeNohe && !showPlayer}>
        <div className="MiniPlayer animate" onClick={() => setShowPlayer(true)}>
            <div className="backdrop-image" style={{ backgroundImage: `url(${activeNohe?.image})` }}></div>
            <div className="content">
                <div className="meta image"><img src={activeNohe?.image} /></div>
                <div class="body">
                    <div className="title">{activeNohe?.title}</div>
                    <div className="subtitle">{activeNohe?.madah?.name}</div>
                </div>
            </div>
            <div className="controls">
                <span className="icon">play_arrow</span>
                <span className="icon">skip_next</span>
            </div>
        </div>
    </Transition>
}

export default memo(MiniPlayer)
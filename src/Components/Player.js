import { useContext, useEffect, useRef, useState } from "react"
import { Ctx } from "../App"

export default function Player() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isRepeated, setIsRepeated] = useState(false)

    const Context = useContext(Ctx)

    const player = useRef()
    const prevButton = useRef()
    const nextButton = useRef()

    const secondsToTime = (e) => {
        console.log()
        if (isNaN(e)) {
            return '00:00'
        }
        const m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0')

        return m + ':' + s;
    }

    useEffect(() => {
        setTimeout(() => {
            if (Context.playlist.indexOf(Context.activeNohe) === 0) {
                prevButton.current.classList.add('disabled')
            } else if (prevButton.current.classList.contains('disabled')) {
                prevButton.current.classList.remove('disabled')
            }
        }, 0);

        if (Context.playlist.length <= Context.playlist.indexOf(Context.activeNohe) + 1) {
            nextButton.current.classList.add('disabled')
        } else if (nextButton.current.classList.contains('disabled')) {
            nextButton.current.classList.remove('disabled')
        }
    }, [Context.activeNohe])

    const onTimeUpdate = () => {
        document.querySelector('.Player .time-control .current-time').innerHTML = secondsToTime(player.current.currentTime);
        document.querySelector('.Player .time-control .duration').innerHTML = secondsToTime(player.current.duration);
        document.querySelector('.seekbar').value = player.current.currentTime;
        document.querySelector('.seekbar').max = player.current.duration;
        document.querySelector('.seekbar').style.backgroundSize = player.current.currentTime / player.current.duration * 100 + '% 100%'
    }

    const onEnded = () => {
        if (!isRepeated && Context.playlist.length > Context.playlist.indexOf(Context.activeNohe) + 1) {
            playNext()
        } else if (isRepeated) {
            player.current.play()
        }
    }

    const playNext = () => {
        Context.playlist.length > Context.playlist.indexOf(Context.activeNohe) + 1 && Context.setActiveNohe(Context.playlist[Context.playlist.indexOf(Context.activeNohe) + 1])
    }

    const playPrev = () => {
        Context.playlist.indexOf(Context.activeNohe) > 0 && Context.setActiveNohe(Context.playlist[Context.playlist.indexOf(Context.activeNohe) - 1])
    }

    return <div className="Player">
        <div className="backdrop-image" style={{ backgroundImage: `url(${Context.activeNohe.image})` }}></div>
        <audio src={Context.activeNohe.url} autoPlay ref={player} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={() => onTimeUpdate()} onEnded={() => onEnded()} />
        <div className="Topbar">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className="content">
            <div className="image"><img src={'http://localhost/nohekhone/src/assets/images/Noheha/' + Context.activeNohe.image} /></div>
            <div className="title">{Context.activeNohe.title}</div>
            <div className="subtitle Madah">{Context.activeNohe.madah.name}</div>
        </div>
        <div className="time-control">
            <div className="time">
                <span className="current-time"></span>
                <span className="duration">{secondsToTime(player.current ? player.current.duration : 0)}</span>
            </div>
            <input className="seekbar" type="range" min="0" max={player.current ? player.current.duration : 100} onInput={(e) => { player.current.currentTime = e.target.value }}></input>
        </div>
        <div className="controls">
            <span className="icon" onMouseEnter={() => {
                document.querySelector('.volume-control').style = ''; document.querySelector('.volume-control input').value = player.current.volume * 100; document.querySelector('.volume-control .seekbar').style.backgroundSize = player.current.volume * 100 + '% 100%'; setTimeout(() => {
                    document.querySelector('.volume-control').classList.remove('hidden');
                }, 0)
            }}>volume_up</span>
            <span className="icon" ref={prevButton} onClick={() => playPrev()}>skip_previous</span>
            <span className="icon" onClick={() => { isPlaying ? player.current.pause() : player.current.play() }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
            <span className="icon" ref={nextButton} onClick={() => playNext()}>skip_next</span>
            <span className={'icon' + (isRepeated ? ' active' : '')} onClick={() => setIsRepeated(!isRepeated)}>restart_alt</span>
            <div className="volume-control hidden" onMouseLeave={() => {
                document.querySelector('.volume-control').classList.add('hidden'); setTimeout(() => {
                    document.querySelector('.volume-control').style.display = 'none'
                }, 300);
            }}>
                <span className="icon">volume_up</span><input class="seekbar" type="range" min="0" max="100" onInput={(e) => { player.current.volume = e.target.value / 100; document.querySelector('.volume-control .seekbar').style.backgroundSize = e.target.value + '% 100%' }} />
            </div>
        </div>
    </div>
}
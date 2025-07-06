import { memo, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Ctx } from "../App"
import Lyrics from "./Lyrics"
import { SetLyrics } from "./SetLyrics"
import { handlePositionTransitionElement, toFarsiNumber } from "../util"

function Player() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isRepeated, setIsRepeated] = useState(false)
    const [showLyrics, setShowLyrics] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)

    const Context = useContext(Ctx)

    const player = useRef()
    const contentRef = useRef()
    const imageRef = useRef()
    const currentTimeRef = useRef()
    const durationRef = useRef()
    const seekBar = useRef()
    const prevButton = useRef()
    const nextButton = useRef()
    const interval = useRef()

    const secondsToTime = (e) => {
        if (isNaN(e)) {
            return '00:00'
        }
        const m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0')

        return m + ':' + s;
    }

    useEffect(() => {
        let volume = localStorage.getItem('player_volume')
        player.current.volume = volume ? volume : 1;
    }, [])

    useLayoutEffect(() => {
        const fromImage = document.querySelector('.MiniPlayer .image img')
        if (!fromImage) return
        const from = fromImage.getBoundingClientRect()
        const to = imageRef.current.getBoundingClientRect()

        contentRef.current.classList.add('image-placeholder')

        const onEnd = () => {
            contentRef.current.classList.remove('image-placeholder')
        }

        handlePositionTransitionElement(from, to, imageRef.current, onEnd)
    }, [])

    useEffect(() => {
        clearInterval(interval.current)
        if (Context.activeNohe.currentTime) {
            player.current.currentTime = Context.activeNohe.currentTime
        }
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

        if (Context.activeNohe)
            interval.current = setInterval(() => {
                if (player.current !== null) {
                    setCurrentTime(player.current.currentTime)
                } else {
                }
            }, 1000)

    }, [Context.activeNohe])

    const onTimeUpdate = () => {
        if (Context.activePage === 'Home' && false) {
            let a = Context.homeActiveNohe;
            a.currentTime = player.current.currentTime
            Context.setHomeActiveNohe(a)
        }
        currentTimeRef.current.innerHTML = toFarsiNumber(secondsToTime(player.current.currentTime));
        durationRef.current.innerHTML = toFarsiNumber(secondsToTime(player.current.duration));
        seekBar.current.value = player.current.currentTime;
        seekBar.current.max = player.current.duration;
        seekBar.current.style.backgroundSize = player.current.currentTime / player.current.duration * 100 + '% 100%'
    }

    const onEnded = () => {
        if (!isRepeated && Context.playlist.length > Context.playlist.indexOf(Context.activeNohe) + 1) {
            playNext()
        } else if (isRepeated) {
            player.current.play()
        }
        clearInterval(interval.current)
    }

    const playNext = () => {
        Context.playlist.length > Context.playlist.indexOf(Context.activeNohe) + 1 && Context.setActiveNohe(Context.playlist[Context.playlist.indexOf(Context.activeNohe) + 1])
    }

    const playPrev = () => {
        Context.playlist.indexOf(Context.activeNohe) > 0 && Context.setActiveNohe(Context.playlist[Context.playlist.indexOf(Context.activeNohe) - 1])
    }

    const jumpToTime = (time) => {
        player.current.currentTime = time
        player.current.play()
    }

    return <><div className="Player">
        <div className="backdrop-image" style={{ backgroundImage: `url(${Context.activeNohe.image})` }}></div>
        <audio src={Context.activeNohe.url} autoPlay ref={player} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={() => onTimeUpdate()} onEnded={() => onEnded()} />
        <div className="Topbar">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className="content" ref={contentRef}>
            <div className="image" ref={imageRef}><img src={Context.activeNohe.image} /></div>
            <div className="title">{Context.activeNohe.title}</div>
            <div className="subtitle Madah">{Context.activeNohe.madah.name}</div>
        </div>
        <div className="time-control">
            <div className="time">
                <span className="current-time" ref={currentTimeRef}></span>
                <span className="duration" ref={durationRef}>{toFarsiNumber(secondsToTime(player.current ? player.current.duration : 0))}</span>
            </div>
            <input className="seekbar" ref={seekBar} type="range" min="0" max={player.current ? player.current.duration : 100} onInput={(e) => { player.current.currentTime = e.target.value }}></input>
        </div>
        <div className="controls">
            <span className="icon" onMouseEnter={() => {
                document.querySelector('.volume-control').style = '';
                document.querySelector('.volume-control input').value = player.current.volume * 100;
                document.querySelector('.volume-control .seekbar').style.backgroundSize = player.current.volume * 100 + '% 100%';
                setTimeout(() => {
                    document.querySelector('.volume-control').classList.remove('hidden');
                }, 0)
            }}>volume_up</span>
            <span className="icon" ref={prevButton} onClick={() => playPrev()}>skip_previous</span>
            <span className="icon" onClick={() => { isPlaying ? player.current.pause() : player.current.play() }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
            <span className="icon" ref={nextButton} onClick={() => playNext()}>skip_next</span>
            <span className={'icon' + (isRepeated ? ' active' : '')} onClick={() => setIsRepeated(!isRepeated)}>restart_alt</span>
            <div className="volume-control hidden" style={{ display: 'none' }} onMouseLeave={() => {
                document.querySelector('.volume-control').classList.add('hidden'); setTimeout(() => {
                    document.querySelector('.volume-control').style.display = 'none'
                }, 300);
            }}>
                <span className="icon">volume_up</span>
                <input class="seekbar" type="range" min="0" max="100" onInput={(e) => {
                    player.current.volume = e.target.value / 100;
                    localStorage.setItem('player_volume', e.target.value / 100)
                    document.querySelector('.volume-control .seekbar').style.
                        backgroundSize = e.target.value + '% 100%'
                }} />
            </div>
        </div>
    </div>
        {(showLyrics) ? <div style={{ position: 'relative' }}>
            <Lyrics currentTime={currentTime} jumpToTime={jumpToTime} />
        </div> : null}
    </>
}

export default memo(Player)
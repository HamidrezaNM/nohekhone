import { memo, useContext, useEffect, useRef, useState } from "react";
import { Ctx } from "../App";
import { SetLyrics } from "./SetLyrics";

function Lyrics({ currentTime, jumpToTime }) {
    const [lyrics, setLyrics] = useState([])
    const [formattedLyrics, setFormattedLyrics] = useState([])
    const [showSetLyrics, setShowSetLyrics] = useState(false)

    const Context = useContext(Ctx)

    const lyricsRef = useRef()

    useEffect(() => {
        const _lyrics = Context.activeNohe?.lyrics?.split('\n') ?? []
        setLyrics(_lyrics)
    }, [Context.activeNohe])

    useEffect(() => {
        const formatted = getLyrics(lyrics)
        formatted.sort((a, b) => a.from - b.from);
        setFormattedLyrics(formatted)
    }, [lyrics])


    useEffect(() => {
        let a = lyricsRef.current.querySelectorAll('.active')
        if (a) {
            var t = a[a.length - 1]?.getBoundingClientRect().top - lyricsRef.current.getBoundingClientRect().top + lyricsRef.current.scrollTop
            var offsetPosition = t - 80;

            lyricsRef.current.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }, [currentTime])

    console.log('lyrics rerendered')

    return <><div className="Lyrics scrollable" ref={lyricsRef}>
        {!Context.activeNohe?.lyrics && !showSetLyrics && <span className="addLyrics" onClick={() => setShowSetLyrics(true)}>اضافه کردن متن</span>}
        {formattedLyrics.map(item => {
            return <span onClick={() => jumpToTime(item?.from)} className={(currentTime && currentTime >= item?.from) ? "active" : ''}>{item?.text}</span>
        })}
    </div>
        {!Context.activeNohe?.lyrics && showSetLyrics && <SetLyrics currentTime={currentTime} lyrics={lyrics} setLyrics={setLyrics} />}
    </>
}

function getLyrics(lyrics) {
    var text;
    var from;

    var arr = []

    lyrics.forEach(item => {
        text = item.split('_')[0]
        from = item.split('_')[1]
        arr.push({ text, from })
    });

    return arr
}

export default memo(Lyrics)
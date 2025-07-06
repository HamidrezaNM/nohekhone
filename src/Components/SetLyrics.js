import { useCallback, useEffect, useRef, useState } from "react"

export function SetLyrics({ currentTime, lyrics, setLyrics }) {
    const [text, setText] = useState('')

    const textarea = useRef()

    useEffect(() => {
        if (lyrics)
            console.log(lyrics?.join(`\n`))
    }, [lyrics])

    const add = useCallback(() => {
        setLyrics([...lyrics, `${text}_${Math.floor(currentTime)}`])
    }, [text])

    const copy = useCallback(() => {

        // Select the text field
        textarea.current.select();
        textarea.current.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(textarea.current.value);
    }, [lyrics])

    return <div className="flex column" style={{ margin: '2px 8px' }}>
        <div className="textfield">
            <input type="text" onKeyDown={(e) => { if (e.key === 'Enter') add() }} value={text} onInput={(e) => setText(e.target.value)} style={{ paddingRight: 54 }} /> <span className="float">{Math.floor(currentTime)}</span>
        </div>
        <textarea style={{ display: "none" }} ref={textarea} value={lyrics?.join('\n')} />
        <div className="flex">
            <button onClick={add}>اضافه کردن</button>
            <button style={{ flex: 1 }} onClick={copy}>کپی</button>
        </div>
    </div>
}
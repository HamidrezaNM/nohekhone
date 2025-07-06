import { useContext, useState, useEffect, useCallback, useRef } from "react"
import { Ctx } from "../App"
import Datalist from "./DataList"
import axios from "axios"

export default function AddNohe({ setNohes }) {
  const [title, setTitle] = useState('')
  const [madah, setMadah] = useState([name => ''])
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [text, setText] = useState('')
  const [submited, setSubmited] = useState(false)

  const Context = useContext(Ctx)

  const Form = useRef()
  const Title = useRef()
  const Madah = useRef()
  const Url = useRef()
  const Submit = useRef()

  const handleSubmit = useCallback(() => {
    if (!title || title === '') {
      Title.current.classList.add('error')
    }
    if (!madah.name || madah.name === '') {
      Madah.current.classList.add('error')
    }
    if (!url || url === '') {
      Url.current.classList.add('error')
    }

    if (title && madah.name && url) {
      Form.current.querySelectorAll('input, textarea').forEach(element => {
        element.disabled = true
      });

      Submit.current.classList.add('loading')

      axios(
        {
          method: 'post',
          url: "http://localhost:4000",
          data: { method: 'addNohe', title, madah: madah.name, url, image, text },
          headers: { "content-type": "application/json" },
        },
      ).then((response) => {
        if (response.data.ok) {
          setNohes(nohes => [...nohes, { _id: Date.now(), title, madah: { _id: 0 }, url, image }])
          Context.setSelectedMadah({
            _id: 0,
            name: "نوحه های من",
            profile: ''
          })

          var _nohes = localStorage.getItem('myNohes')
          _nohes = JSON.parse(_nohes)
          localStorage.setItem('myNohes', JSON.stringify([..._nohes, { _id: Date.now(), title, madah: { _id: 0 }, url, image }]))

          Context.setActivePage('Home')
        }
      })
    }
  }, [title, madah, url, image, text])

  useEffect(() => {
    if (title !== '') {
      Title.current.classList.remove('error')
    }
    if (madah.name !== '') {
      Madah.current.classList.remove('error')
    }
    if (url !== '') {
      Url.current.classList.remove('error')
    }

    Context.setActiveNohe({
      title: title == '' ? 'نام نوحه' : title,
      madah: madah.name == '' ? { name: 'نام مداح' } : madah,
      url,
      image
    })
  }, [title, madah, url, image, text])

  return <>{!submited ? <div className="Add rtl">
    <div className="form" ref={Form}>
      <div className="title textfield" ref={Title}>
        <input type="text" placeholder=" " value={title} onInput={(e) => { setTitle(e.target.value) }} />
        <label>نام نوحه</label>
      </div>
      <div className="madah textfield" ref={Madah}>
        <Datalist name="مداح" data={Object.values(Context.madahes).filter(item => { return item._id !== 0 })} onSelect={(value) => { setMadah({ name: value }) }} />
      </div>
      <div className="url textfield" ref={Url}>
        <input type="text" placeholder=" " value={url} onInput={(e) => { setUrl(e.target.value) }} />
        <label>لینک نوحه</label>
      </div>
      <div className="image textfield">
        <input type="text" placeholder=" " value={image} onInput={(e) => { setImage(e.target.value) }} />
        <label>لینک عکس نوحه (اختیاری)</label>
      </div>
      <div className="text textfield textarea">
        <textarea placeholder=" " value={text} onInput={(e) => { setText(e.target.value) }} />
        <label>متن نوحه (اختیاری)</label>
      </div>
      <button ref={Submit} onClick={handleSubmit} style={{ margin: '0 12px' }}>ثبت نوحه</button>
    </div>
  </div> :
    <div className="success">
      <div>
        <span className="icon">done</span>
        <div className='Items AddedNohe'>
          <div className='item'>
            <div className='meta image'><img src={image} /></div>
            <div className='body'>
              <div className='title'>{title}</div>
              <div className='subtitle'>{madah.name}</div>
            </div>
          </div>
        </div>
        <span className="content">نوحه شما با موفقیت ثبت شد و بعد از تایید نمایش داده خواهد شد</span>
      </div>
      <button onClick={() => setSubmited(false)}>بازگشت</button>
    </div>}
  </>
}
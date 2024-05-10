import { useContext, useState, useEffect } from "react"
import { Ctx } from "../App"
import Datalist from "./DataList"

export default function AddNohe() {
  const [title, setTitle] = useState('')
  const [madah, setMadah] = useState([name => ''])
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [text, setText] = useState('')

  const Context = useContext(Ctx)

  useEffect(() => {
    Context.setActiveNohe({
      title: title == '' ? 'نام نوحه' : title,
      madah: madah.name == '' ? { name: 'نام مداح' } : madah,
      url,
      image
    })
  }, [title, madah, url, image, text])

  return <div className="Add rtl">
    <div className="form">
      <div className="title textfield">
        <input type="text" placeholder=" " value={title} onInput={(e) => { setTitle(e.target.value) }} />
        <label>نام نوحه</label>
      </div>
      <div className="madah textfield">
        <Datalist name="مداح" data={Context.madahes} onSelect={(value) => { setMadah({ name: value }) }} />
      </div>
      <div className="url textfield">
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
      <button>ثبت نوحه</button>
    </div>
  </div>
}
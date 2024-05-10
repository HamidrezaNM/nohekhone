import { useContext, useRef, useEffect } from "react"
import { Ctx } from "../App"

export default function Drawer() {
  const Context = useContext(Ctx)
  
  const drawer = useRef();
  const modal = useRef();

  useEffect(() => {
    modal.current.onclick = () => {
      drawer.current.classList.remove('active')
      modal.current.classList.add('hidden')
      setTimeout(() => {
        modal.current.style.display = 'none'
      }, 300)
    }
    drawer.current.querySelectorAll('.Item').forEach((item) => {
      console.log(item)
      item.onclick = () => {
        drawer.current.querySelectorAll('.Item').forEach((item) => {
          item.classList.remove('active')
        })
        item.classList.add('active')
        Context.setActivePage(item.getAttribute('page'))
        modal.current.click()
      }
    })
  }, [])
  
  return (
    <>
    <div className="Drawer" ref={drawer}>
      <div>
        <div className="Item active" page="Home"><span className="icon">home</span><span className="title">خانه</span></div>
        <div className="Item" page="Add"><span className="icon" >add</span><span className="title">افزودن نوحه</span></div>
      </div>
      <div>
        <div className="version">
          <span className="title">نوحه خونه وب - نسخه 0.9.0</span>
        </div>
      </div>
    </div>
    <div className="modal-back hidden" ref={modal}></div>
    </>
  )
}
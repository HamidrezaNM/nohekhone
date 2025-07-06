import { useContext, useRef, useEffect } from "react"
import { Ctx } from "../App"
import packageInfo from '../../package.json';
import buildClassName, { toFarsiNumber } from "../util";
import Transition from "./Transition";

export default function Drawer() {
  const Context = useContext(Ctx)

  const drawer = useRef();
  const modal = useRef();

  useEffect(() => {
    drawer.current.querySelectorAll('.Item').forEach((item) => {
      console.log(item)
      item.onclick = () => {
        drawer.current.querySelectorAll('.Item').forEach((item) => {
          item.classList.remove('active')
        })
        item.classList.add('active')
        Context.setActivePage(item.getAttribute('page'))
        Context.setShowDrawer(false)
      }
    })
  }, [])

  return (
    <>
      <div className={buildClassName("Drawer", Context.showDrawer && 'active')} ref={drawer}>
        <div>
          <div className="Item active" page="Home"><span className="icon">home</span><span className="title">خانه</span></div>
          <div className="Item" page="Add"><span className="icon" >add</span><span className="title">افزودن نوحه</span></div>
        </div>
        <div>
          <div className="version">
            <span className="title">نوحه خونه وب - نسخه {toFarsiNumber(packageInfo.version)}</span>
          </div>
        </div>
      </div>
      <Transition state={Context.showDrawer}>
        <div className="modal-back" onClick={() => Context.setShowDrawer(false)} ref={modal}></div>
      </Transition>
    </>
  )
}
export default function Card({ image, title, subtitle, onClick = () => { }, className = '' }) {
    return <div className={"Card" + (className != '' ? ' ' + className : '')} onClick={onClick}>
        <div className="image"><img src={image} /></div>
        <div className="content">
            <div className="title">{title}</div>
            <div className="subtitle">{subtitle}</div>
        </div>
    </div>
}
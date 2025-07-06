export const isMobile = document.body.clientWidth <= 600

export function toFarsiNumber(n) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return n
        .toString()
        .split('')
        .map(x => farsiDigits[x] || x)
        .join('');
}

export default function buildClassName(...params) {
    return params.filter(Boolean).join(' ')
}

export function handlePositionTransitionElement(from, to, element, onEnd = () => { }) {
    if (from) {
        element.style.position = 'fixed'
        element.style.left = from.left + 'px'
        element.style.top = from.top + 'px'
        element.style.width = from.width + 'px'
        element.style.height = from.height + 'px'

        requestAnimationFrame(() => {
            setTimeout(() => {
                element.style.transition = 'all .3s ease'
                element.style.left = to.left + 'px'
                element.style.top = to.top + 'px'
                element.style.width = to.width + 'px'
                element.style.height = to.height + 'px'
                setTimeout(() => {
                    element.style.position = ''
                    onEnd()
                }, 300);
            }, 40)
        })
    }
}
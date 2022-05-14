import chat from '../../public/assets/icon-chat.png'
import money from '../../public/assets/icon-money.png'
import security from '../../public/assets/icon-security.png'
import PropTypes from 'prop-types';
import Image from 'next/image';
import style from '../../styles/components/index.module.scss'

/**
 * Build the 3 features on Homepage
 * @param {object} value - Values to build a feature component
 * @returns A React component.
 */
const Feature = ({ value }) => {
    const { type, title, text } = value
    const imgSrc = {
        chat: chat,
        money: money,
        security: security
    }

    return (
        <div className={style.featureItem}>
            <div className={style.featureIcon}>
                <Image
                    src={imgSrc[type]}
                    alt={`${type} Icon`}
                />
            </div>
            <h3 className={style.featureItemTitle}>{title}</h3>
            <p>
                {text}
            </p>
        </div>
    )
}

export default Feature

Feature.propTypes = {
    value: PropTypes.objectOf(PropTypes.string)
}

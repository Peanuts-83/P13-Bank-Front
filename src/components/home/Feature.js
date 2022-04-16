import chat from '../../assets/icon-chat.png'
import money from '../../assets/icon-money.png'
import security from '../../assets/icon-security.png'
import PropTypes from 'prop-types';

/**
 * It takes in a value prop, destructures the type, title, and text from the value prop, and then
 * returns a div with an image, title, and text
 * @returns A div with an image, h3, and p tag.
 */
const Feature = ({ value }) => {
    const { type, title, text } = value
    const imgSrc = {
        chat: chat,
        money: money,
        security: security
    }

    return (
        <div className="feature-item">
            <img src={imgSrc[type]} alt={`${type} Icon`} className="feature-icon" />
            <h3 className="feature-item-title">{title}</h3>
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
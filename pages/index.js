import { faCircleUser, faSignOut, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
// Global FontAwesome icons lib
library.add(faCircleUser, faSignOut, faArrowLeft)
import style from '../styles/components/index.module.scss'
import Feature from '../components/home/Feature'
import Layout from '../components/Layout';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { initProfile } from '../store/slices/userIdSlice'

/**
 * It renders Homepage
 * @returns A function that returns a main element with a div and a section.
 */
export default function Home() {
    const dispatch = useDispatch()

    // Initiate user profile
    useEffect(() => {
        dispatch(initProfile())
    })

    const features = [
        {
            type: "chat",
            title: "You are our #1 priority",
            text: "Need to talk to a representative? You can get in touch through our 24/7 chat or through a phone call in less than 5 minutes.",
        },
        {
            type: "money",
            title: "More savings means higher rates",
            text: "The more you save with us, the higher your interest rate will be!",

        },
        {
            type: "security",
            title: "Security you can trust",
            text: "We use top of the line encryption to make sure your data and money is always safe.",

        }
    ]

    return (
        <Layout>
            <main className={style.main}>
                <div className={style.hero} style={{ backgroundImage: 'url(assets/bank-tree.jpeg)' }}>
                    <section className={style.heroContent}>
                        <h2 className={style.srOnly}>Promoted Content</h2>
                        <p className={style.subtitle}>No fees.</p>
                        <p className={style.subtitle}>No minimum deposit.</p>
                        <p className={style.subtitle}>High interest rates.</p>
                        <p className={style.text}>Open a savings account with Argent Bank today!</p>
                    </section>
                </div>
                <section className={style.features}>
                    <h2 className={style.srOnly}>Features</h2>
                    {features.map((feature, index) => (
                        <Feature value={feature} key={`feature-${index}`} />
                    ))}
                </section>
            </main>
        </Layout>
    )
}

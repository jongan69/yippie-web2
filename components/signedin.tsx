import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Switch from './switch';
import MemeForm from './ui/form'
import { fetchGameData } from '@/lib/fetchGameData';

const SignedIn = (props: any) => {
    const [gameData, setGameData] = useState([]);
    const [lastDirection, setLastDirection] = useState('');
    const [lastItem, setLastItem] = useState<any>();
    const [mode, setMode] = useState('swipe');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchGameData(props.publicKey);
                setGameData(data);
                // alert(JSON.stringify(gameData))
                setLoading(false);
            } catch (error) {
                console.error('Error fetching game data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChangeMode = (newMode: any) => {
        setMode(newMode ? 'post' : 'swipe');
    };

    const swiped = async (direction: any, item: any) => {
        console.log(`You swiped ${direction} on ${item}`);
        setLastItem(item)
        const updateField = direction === 'right' ? 'likes' : 'dislikes';
        const itemId = lastItem._id;
        const user = props.publicKey

        const body = JSON.stringify({
            memeId: itemId,
            action: updateField,
            user
        })

        await fetch("/api/postInteraction", {
            method: "POST",
            body 
        })

        setLastDirection(direction);
    };

    const outOfFrame = (name: any) => {
        console.log(JSON.stringify(name) + ' left the screen!');
    };

    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-red-500 to-indigo-400 p-4">
            <div className="flex max-h-screen min-h-screen flex-col">
                <h1 className="text-2xl font-bold text-white ">BetterFade</h1>
                <br />
                <h3 className="text-2xl font-bold text-white ">Swipe left to fade</h3>
                <h3 className="text-2xl font-bold text-white ">Swipe Right to bet</h3>
                <br />
                <Switch onChange={handleChangeMode} />
            </div>
            {mode === 'post' ? <MemeForm publicKey={props.publicKey} />
                :
                loading ? (
                    <p>Loading...</p>
                ) : gameData?.length > 0 ? (
                    <>
                        <div className="relative w-full max-w-screen-lg">
                            {gameData.map((item: any, index) => (
                                <TinderCard
                                    className='swipe absolute'
                                    key={item?._id}
                                    onSwipe={(dir) => swiped(dir, item)} // Listen for swipes
                                    onCardLeftScreen={() => outOfFrame(item)}
                                >
                                    <div
                                        style={{ backgroundImage: `url(${item?.url})` }}
                                        className='rounded-xlg flex h-full items-end bg-cover bg-center p-20 shadow-lg'
                                    >
                                        <h3 className='/50 rounded-md bg-black px-2 py-1 text-lg text-white'>{item?.metadata?.title}</h3>
                                    </div>
                                </TinderCard>
                            ))}
                        </div>
                        {lastDirection ? (
                            <h2 className='infoText pb- 10 text-white'>
                                {lastDirection === 'left' && `You faded ${JSON.stringify(lastItem?.metadata?.title)}`}
                                {lastDirection === 'right' && `You'd like to bet on ${JSON.stringify(lastItem?.metadata?.title)}`}
                                {lastDirection === 'up' && `Youre lost`}
                                {lastDirection === 'down' && `Go get some water`}
                            </h2>
                        ) : (
                            <h2 className='infoText text-white'>
                                You have not swiped yet.
                            </h2>
                        )}
                    </>
                ) : <p>No game data available.</p>
            }
        </div>
    );
}

export default SignedIn;

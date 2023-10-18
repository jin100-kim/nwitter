import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, onSnapshot, orderBy} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    
    /*
    const getNweets = async () => {
        const dbNweets = await getDocs(collection(dbService,"nweets"));
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            }
            setNweets((prev) => [nweetObject, ...prev]);
        });
    }
    */
    useEffect(() => {
        //getNweets();
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );

        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        })
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService,"nweets"),{
            text: nweet,
            createdAt: Date.now(),
            createrId: userObj.uid,
        });
        setNweet("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="무슨 일이 일어나고 있나요?"
                    maxLength={120}
                    onChange={onChange} 
                    value={nweet}
                />
                <input type="submit" value="Nwitter" />
            </form>
            <div>
            {nweets.map((nweetObj) => (
                <Nweet
                    key={nweetObj.id}
                    nweetObj={nweetObj}
                    isOwner={nweetObj.createrId === userObj.uid} />
            ))}
            </div>

        </div>
    );
};


export default Home;
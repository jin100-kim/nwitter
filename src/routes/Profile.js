import Nweet from "components/Nweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default ({ userObj, refreshUser }) => {
    const [nweets, setNweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc"),
            where("createrId", "==", userObj.uid)
        );

        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        })
    }, []);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (newDisplayName != "" && userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        };
    };
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange} 
                    type="text"
                    autoFocus 
                    placeholder="Display name"
                    value={newDisplayName}
                    className="formInput" />
                <input
                type="submit"
                value="Update Profile"
                className="formBtn"
                style={{
                    marginTop: 10,
                }} />
            </form>
            <div>
            {nweets.map((nweetObj) => (
                <Nweet
                    key={nweetObj.id}
                    nweetObj={nweetObj}
                    isOwner={nweetObj.createrId === userObj.uid} />
            ))}
            </div>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

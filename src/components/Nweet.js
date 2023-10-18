import { dbService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const nweetOne = doc(dbService, "nweets", nweetObj.id);
    const onDeleteClick = async () => {
        const ok = window.confirm("are you sure?");
        console.log(ok);
        if (ok) {
            await deleteDoc(nweetOne);
        }
    }
    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(nweetOne, { text: newNweet, });
        setEditing(false);
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    return(
        <div>
            {editing ? (
                <form onSubmit={onSubmit}>
                    <input value={newNweet} onChange={onChange} required />
                    <button onClick={toggleEditing}>Cancel</button>
                    <input type="submit" value="Update Nweet"></input>
                </form>
                ) : (
            <>
                <h4>{nweetObj.text}</h4>
                {isOwner && (
                    <>
                    <button onClick={onDeleteClick}>Delete Nweet</button>
                    <button onClick={toggleEditing}>Edit Nweet</button>
                    </>
                )}
            </>
            )}
        </div>
    )
};

export default Nweet;
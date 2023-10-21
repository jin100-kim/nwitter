import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const inputFileTag = useRef(null); 

    const onSubmit = async (event) => {
        let attachmentUrl = "";
        if (nweet === "") {
            return;
        }

        if (attachment != "") {
            event.preventDefault();
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            await uploadString(fileRef, attachment, 'data_url');
            attachmentUrl = await getDownloadURL(fileRef);
            console.log(attachmentUrl);
        }
        await addDoc(collection(dbService,"nweets"),{
            text: nweet,
            createdAt: Date.now(),
            createrId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        onClearAttachment();
    };

    const onClearAttachment = () => {
        setAttachment("");
        inputFileTag.current.value = null;
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        console.log(event.target.files);
        const filelist = event.target.files;
        const theFile = filelist[0];
        const reader = new FileReader(theFile);
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result)
        };
        reader.readAsDataURL(theFile);
    };
    return (
        
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factiryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="무슨 일이 일어나고 있나요?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
        <input
            id="attach-file"
            type="file"
	        ref={inputFileTag}
            accept="image/*"
            onChange={onFileChange}
            style={{
            opacity: 0,
            
            }}
        />
        {attachment && (
        <div className="factoryForm__attachment">
            <img
            src={attachment}
            style={{
                backgroundImage: attachment,
            }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>
        )}
    </form>
    );
 };

export default NweetFactory;
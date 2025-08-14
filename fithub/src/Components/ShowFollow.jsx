import { useEffect, useRef, useState } from 'react'
import { db, auth } from "../client.js";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

const ShowFollow = ({ isOpen, onClose, list, currUser }) => {
    const dialogRef = useRef(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followersDetails, setFollowersDetails] = useState([]);
    const [followingDetails, setFollowingDetails] = useState([]);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const userRef = doc(db, "Users", auth.currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setFollowers(snapshot.data().followers);
                setFollowing(snapshot.data().following);
            }
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if (!followers.length) {
            setFollowersDetails([]);
            return;
        }
        const fetchFollowers = async () => {
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("__name__", "in", followers.slice(0, 10))); 
            // Firestore "in" query limit: max 10 IDs per query
            const snap = await getDocs(q);
            const details = snap.docs.map(d => ({
                uid: d.id,
                name: d.data().name || d.id
            }));
            setFollowersDetails(details);
        };
        fetchFollowers();
    }, [followers]);

    useEffect(() => {
        if (!following.length) {
            setFollowingDetails([]);
            return;
        }
        const fetchFollowing = async () => {
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("__name__", "in", following.slice(0, 10)));
            const snap = await getDocs(q);
            const details = snap.docs.map(d => ({
                uid: d.id,
                name: d.data().name || d.id
            }));
            setFollowingDetails(details);
        };
        fetchFollowing();
    }, [following]);

    const handleClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        onClose();
    }

    const removeFollow = async (user) => {
        const userRef = doc(db, "Users", user);
        const currUserRef = doc(db, "Users", auth.currentUser.uid);
        if (list === "followers") {
            await updateDoc(currUserRef, {followers: arrayRemove(user)});
            await updateDoc(userRef, {following: arrayRemove(auth.currentUser.uid)});
        } else {
            await updateDoc(currUserRef, {following: arrayRemove(user)});
            await updateDoc(userRef, {followers: arrayRemove(auth.currentUser.uid)});
        }
    }

    return (
        <div>
            <dialog ref={dialogRef} onCancel={handleClose}>
                <div className="header">{list === "followers" ? 
                    <h2>Followers</h2> : <h2>Following</h2>}
                    <button onClick={handleClose}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                <div className="container">
                    {list === "followers" ? followersDetails.map((user) => 
                        <div key={user.uid}>
                            <h3>{user.name}</h3>
                            <button onClick={() => removeFollow(user.uid)}>Remove</button>
                        </div>) : 
                        followingDetails.map((user) => 
                        <div key={user.uid}>
                            <h3>{user.name}</h3>
                            <button onClick={() => removeFollow(user.uid)}>Unfollow</button>
                        </div>)
                    }
                </div>
            </dialog>
        </div>
    )
}

export default ShowFollow
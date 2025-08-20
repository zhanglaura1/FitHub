import { useState, useEffect } from 'react'
import { db } from "./client.js";
import Post from './Components/Post'
import './App.css'
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

function App() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [sort, setSort] = useState("recent");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "Posts"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            // normalize fields so code below doesn't blow up if something is missing
            userId: data.userId || "",
            description: data.description || "",
            likes: Array.isArray(data.likes) ? data.likes : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            img: data.img || "",
            created_at: data.created_at ? data.created_at.toDate?.() ?? data.created_at : null
          };
        });
        setPosts(docs);
      },
      (error) => {
        console.error("Error listening to posts:", error);
      }
    );

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    let filtered = posts;

    // Filter by tags: require every selected tag to be present in post.tags
    if (tags.length > 0) {
      if (tags.length === 1 && tags.includes("show-all")) {
        filtered = posts;
      } else {
        filtered = filtered.filter((post) =>
          tags.every((tag) => post.tags && post.tags.includes(tag))
        );
      }
    }

    // Filter by search input (search description and name)
    if (searchInput.trim() !== "") {
      const q = searchInput.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          (post.description && post.description.toLowerCase().includes(q))
      );
    }

    // Sort: likes or recent
    if (sort === "likes") {
      filtered = [...filtered].sort((a, b) => (b.likes.length) - (a.likes.length));
    } else {
      // recent: sort by created_at (newest first). If no created_at, keep original order.
      filtered = [...filtered].sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      });
    }

    setFilteredResults(filtered);
  }, [tags, searchInput, posts, sort])

  return (
    <div className="">
      <h1 className="text-black text-center text-4xl m-10">Welcome to Fithub</h1>
      <div className="flex flex-wrap gap-x-10 gap-y-10 justify-center align-center mb-10">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-10 w-100 border-1 border-#ccc bg-white rounded-4xl pl-5"
        />
        <div className="flex gap-x-3">
          <label htmlFor="tag_filter">Filter: </label>
          <select name="tag_filter" id="tag_filter" multiple onChange={(input => setTags(Array.from(input.target.options).filter(option => option.selected).map(option => option.value)))}
            className="h-10 w-40 border-1 border-#ccc bg-white rounded-sm pl-1">
            <option value="show-all" default>Show All</option>
            <option value="streetwear">Streetwear</option>
            <option value="y2k">Y2K</option>
            <option value="vintage">Vintage</option>
            <option value="cottagecore">Cottagecore</option>
            <option value="emo">Emo</option>
            <option value="coquette">Coquette</option>
            <option value="indie">Indie</option>
            <option value="minimalist">Minimalist</option>
            <option value="granola">Granola</option>
            <option value="monochrome">Monochrome</option>
            <option value="chic">Chic</option>
            <option value="basic">Basic</option>
            <option value="academia">Academia</option>
            <option value="formal">Formal</option>
            <option value="business-cas">Business Casual</option>
            <option value="western">Western</option>
            <option value="coastal">Coastal</option>
          </select>
        </div>
        <div className="flex gap-x-3">
          <label htmlFor="sort">Sort by: </label>
          <select name="sort" id="sort" value={sort} onChange={(input => setSort(input.target.value))}
            className="h-8 w-40 border-1 border-#ccc bg-white rounded-sm pl-1">
            <option value="recent" default>Most Recent</option>
            <option value="likes">Likes</option>
          </select>
        </div>
      </div>
      <div className="grid grid-flow-col grid-cols-3 gap-4">
        {filteredResults.length > 0 > 0 ? 
            (filteredResults.map((data) => (
            <Post
              key={data.id}
              id={data.id}
              userId={data.userId}
              created_at={data.created_at}
              description={data.description}
              likes={data.likes}
              img={data.img}
              tags={data.tags}
              comments={data.comments}
            />)))
            : 
            (
            <div>No posts found.</div>
            )
        }
      </div>
    </div>
  )
}

export default App

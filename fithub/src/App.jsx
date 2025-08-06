import { useState, useEffect } from 'react'
import { supabase } from './client'
import Post from './Components/Post'
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [sort, setSort] = useState("recent");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
        const {data} = await supabase.from("Posts").select().order('created_at', {ascending: true})
        setPosts(data);
    }
    fetchAllPosts();
  }, [])

  useEffect(() => {
    const filterItems = () => {
      let filteredData = [...posts];
      if (tags.length > 0) {
        filteredData = filteredData.filter(post =>
                tags.every(tag => post.tags && post.tags.includes(tag)));     
      }
      if (searchInput.trim() !== "") {
        filteredData = filteredData.filter((post) => post.description.toLowerCase().includes(searchInput.toLowerCase()));
      }
      setFilteredResults(filteredData);
    }
    filterItems();
  }, [tags, searchInput, posts])

  const sortedResults = [...filteredResults].sort((a,b) => {
    if (sort === "likes") return b.likes - a.likes;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div>
      <h1>Welcome to Fithub</h1>
      <div className="filters_sort">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <label htmlFor="tag_filter">Filter: </label>
        <select name="tag_filter" id="tag_filter" multiple onChange={(input => setTags(Array.from(input.target.options).filter(option => option.selected).map(option => option.value)))}>
          <option value="" default></option>
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
        <label htmlFor="sort">Sort by: </label>
        <select name="sort" id="sort" value={sort} onChange={(input => setSort(input.target.value))}>
          <option value="recent" default>Most Recent</option>
          <option value="likes">Likes</option>
        </select>
      </div>
      {posts && posts.length > 0 ? 
          (sortedResults.map((data) => (
          <Post
            key={data.id}
            id={data.id}
            user_name={data.user_name}
            creation_time={data.creation_time}
            description={data.description}
            likes={data.likes}
            img={data.img}
            tags={data.tags}
            comments={data.comments}
          />)))
          : 
          (
          <div></div>
          )
      }
    </div>
  )
}

export default App

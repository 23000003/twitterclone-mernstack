import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext";
import { getUsersFollowingPosts } from "../controller/PostController";
import { ConvertDate } from "../scripts/TimeConverter";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../contexts/PostContext";

export default function FollowingPost() {

    const [followingPost, setFollowingPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { post, setPost } = useContext(PostContext);
    const { user } = useContext(UserContext);

    useEffect(() =>{
        console.log(post);
        console.log(user._id);

        if(post !== undefined ){
            setTimeout( async () => {
                try{
                    // const data = await getUsersFollowingPosts(user._id);
                    console.log(user);
                    console.log(post.author)
                    const temp = post.filter(post => post.author.followers.includes(user._id) || post.author._id.toString() === user._id.toString());
                    setFollowingPost(temp);
                    setLoading(false);
                }catch(err){
                    console.log(err);
                }
    
            }, 1000)
        }
        
    },[post])

    console.log(followingPost);

    return (
        <>
        {!loading ? (
            post ? (
                post.map((post, index) => (
                    <div className='border-b hover:bg-slate-100 cursor-pointer' onClick={() => navigate(`/${post.author.username}/status/${post._id}`)} key={index}>
                        <div className="pt-5 px-5">
                            <div className='flex flex-row font-twitterChirp h-full w-full'>
                                <span className='h-full'>
                                    <img src={post.author.profile_pic} className="w-9 rounded-2xl" alt="Guest" />
                                </span>
                                <div className='flex flex-col w-full'>
                                    <div className='flex flex-row ml-4'>
                                        <span className='font-semibold'>{post.author.username}</span>
                                        <span className='ml-2 text-gray-400'>@ {post.author.username} • {ConvertDate(post.date_created)}</span>
                                    </div>
                                    <div className='ml-4'>
                                        <span>{post.content}</span>
                                        {post.content_image !== " " && <img src={post.content_image} className='w-full my-2 rounded-lg' onClick={() => setViewContentImage(true)}/>}
                                    
                                    </div>
                                    <div className='mx-4 my-2 flex justify-between'>
                                        <span>
                                            <i className="fa-regular fa-comment text-gray-500"></i>
                                            <span className='text-sm ml-2 text-gray-400'>{post.comments.length}</span>
                                        </span>
                                        {post.reposted_by.includes(user._id) ? (
                                            <span onClick={(e) => {e.stopPropagation(); TriggerUndoRepostByYou(post._id);}}>
                                                <i className="fa-solid fa-retweet text-green-500"></i>
                                                <span className='text-sm ml-2 text-green-500'>{post.reposted_by.length}</span>
                                            </span>
                                        ) : (
                                            <span onClick={(e) => {e.stopPropagation(); TriggerRepostByYou(post._id);}}>
                                                <i className="fa-solid fa-retweet text-gray-500"></i>
                                                <span className='text-sm ml-2 text-gray-400'>{post.reposted_by.length}</span>
                                            </span>
                                        )}
                                        {post.likes.includes(user._id) ? (
                                            <span onClick={(e) => {e.stopPropagation(); TriggerUnLikeByYou(post._id);}}  className='hover:bg-gray-500'>
                                                <i className="fa-solid fa-heart text-red-500"></i>
                                                <span className='text-sm ml-2 text-red-500'>{post.likes.length}</span>
                                            </span>
                                        ) : (
                                            <span onClick={(e) => {e.stopPropagation(); TriggerLikeByYou(post._id);}}  className='hover:bg-gray-500'>
                                                <i className="fa-regular fa-heart text-gray-500"></i>
                                                <span className='text-sm ml-2 text-gray-400'>{post.likes.length}</span>
                                            </span>
                                        )}
                                        <span>
                                            <i className="fa-regular fa-bookmark text-gray-500"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <h3>NO POST</h3>
            )
        ) : (
            <span>Loading...</span>
        )}
        </>
    )
}

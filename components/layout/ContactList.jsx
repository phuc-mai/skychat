// "use client";

// import Loader from "@components/Loader";
// import { Search } from "@mui/icons-material";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const ContactList = () => {
//   const {data: session} = useSession();
//   const currentUser = session?.user;

//   const [loading, setLoading] = useState(true);
//   const [people, setPeople] = useState([]);

//   const getPeople = async () => {
//     const res = await fetch("/api/users");
//     const data = await res.json();
//     setPeople(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getPeople();
//   }, []);

//   const router = useRouter();

//   const handleClick = async (data) => {
//     const res = await fetch("/api/chats", {
//       method: "POST",
//       body: JSON.stringify({
//         currentUserId: currentUser._id,
//         partnerId: data._id,
//       }),
//     });

//     const chat = await res.json();

//     if (res.ok) {
//       router.push(`/chats/${chat._id}`);
//     }
//   };

//   return !session || loading ? (
//     <Loader />
//   ) : (
//     <div className="chat-list">
//       <div className="input-container">
//         <input
//           placeholder="Search Chats..."
//           name="search"
//           className="input-field"
//         />
//         <Search
//           sx={{
//             color: "#737373",
//             cursor: "pointer",
//             "&:hover": { color: "#ff5252" },
//           }}
//         />
//       </div>

//       <div className="chats">
//         {people.map((person, index) => (
//           <div className="chat" key={index} onClick={() => handleClick(person)}>
//             {person?.profileImagePath === "" ? (
//               <img
//                 src="/assets/person.jpg"
//                 alt="profile"
//                 className="profilePhoto"
//               />
//             ) : (
//               <img
//                 src={person.profileImage}
//                 alt="profile"
//                 className="profilePhoto"
//               />
//             )}

//             <div className="text">
//               <p className="text-base-bold">{person.username}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ContactList;

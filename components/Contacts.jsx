"use client";

import { CheckCircle, RadioButtonUnchecked, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Contacts = () => {
  /* GET ALL CONTACTS*/
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchContact, setSearchContact] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        searchContact !== ""
          ? `/api/users/searchContact/${searchContact}`
          : "/api/users",
        {
          method: "GET",
        }
      );

      const data = await res.json();
      setContacts(data.filter((member) => member._id !== currentUser._id));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, searchContact]);

  /* SELECT CONTACTS */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  /* ADD NAME */
  const [name, setname] = useState("");

  /* CREATE CHAT */
  const router = useRouter();

  const createChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });

    const chat = await res.json();

    if (res.ok) {
      router.push(`/chats/${chat._id}`);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat">
      <input
        placeholder="Search Contacts..."
        className="input-search"
        value={searchContact}
        onChange={(e) => setSearchContact(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.map((user, index) => (
            <div
              key={index}
              className="contact"
              onClick={() => handleSelect(user)}
            >
              {
                /* Check if contact is selected */
                selectedContacts.find((item) => item === user) ? (
                  <CheckCircle sx={{ color: "red" }} />
                ) : (
                  <RadioButtonUnchecked />
                )
              }
              <img
                src={user.profileImage || "/assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{user.username}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-7">
          {selectedContacts.length > 1 && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group chat name</p>
                <input
                  placeholder="Enter group chat name"
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button className="btn" onClick={createChat}>
            START A NEW CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

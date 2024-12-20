import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { ImFileEmpty } from "react-icons/im";

Modal.setAppElement('#root')

export default function Home() {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShow: false,
        type: "add",
        data: null
    })

    const [userInfo, setUserInfo] = useState(null)
    const [allNotes, setAllNotes] = useState([])

    const navigate = useNavigate()

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShow: true,
            type: "edit",
            data: noteDetails
        })
    }

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user')
            if (response.data && response.data.user) {
                setUserInfo(response.data.user)
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear()
                navigate('/login')
            }
        }
    }

    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get('/get-all-note')
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes)
            }
        } catch (error) {
            console.error("An unexpected error occurred. Please try again.", error)
        }
    }

    const deleteNote = async (data) => {
        const noteId = data._id

        try {
            const response = await axiosInstance.delete("/delete-note/" + noteId)

            if (response.data && response.data.message) {
                toast.success('Deleted Successfully!', {
                    duration: 3000,
                    position: 'bottom-left'
                })
                getAllNotes()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error("An unexpected error occurred. Please try again.")
            }
        }
    }

    const updateIsPinned = async (noteData) => {
        const nodeId = noteData._id

        try {
            const response = await axiosInstance.put("/update-pin-note/" + nodeId, {
                "isPinned": !noteData.isPinned
            })

            if (response.data && response.data.note) {
                toast.success('Pin Updated Successfully!', {
                    duration: 3000,
                    position: 'bottom-left'
                })
                getAllNotes()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllNotes()
        getUserInfo()

        return () => { }
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} />

            <div className="w-[80%] mx-auto">
                {allNotes.length > 0 ? (<div className="grid grid-cols-3 gap-4 mt-8">
                    {allNotes.map((item) => (
                        <NoteCard
                            key={item._id}
                            title={item.title}
                            date={item.createdOn}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => deleteNote(item)}
                            onPinNote={() => updateIsPinned(item)}
                        />
                    ))}
                </div>)
                    : <div className="text-center flex flex-col items-center justify-center mt-40 gap-5 opacity-50">
                        <ImFileEmpty size={50} />
                        <p>No notes here yet. Let’s start writing your first note!</p>
                    </div>
                }

                <button
                    className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                    onClick={() => setOpenAddEditModal({ isShow: true, type: 'add', data: null })}
                >
                    <MdAdd className="text-[32px] text-white" />
                </button>
            </div>
            <Modal
                isOpen={openAddEditModal.isShow}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
            >
                <AddEditNotes
                    onClose={() => { setOpenAddEditModal({ isShow: false, type: 'add', data: null }) }}
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    getAllNotes={getAllNotes}
                />
            </Modal>


        </>
    )
}

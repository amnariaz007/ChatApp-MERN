import React, { useEffect, useState } from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { FaPlus } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import { GET_ALL_CONTACT, HOST, CREATE_CHANNEL  } from '@/utils/constants'



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store';
import MultipleSelector from '@/components/ui/multipleselect';

const CreateChannel = () => {

    const {setSelectedChatType, setSelectedChatData, addChannel} = useAppStore()
    const [newchannelmodel, setnewchannelmodel] = useState(false);
    const [searchedContacts, setsearchedContacts] = useState([]);
    const [ allcontacts, setallcontacts] = useState([]);
    const [selectedcontacts, setselectedcontacts] = useState([]);
    const [channelname, setchannelname] = useState("");


    useEffect(() => {
     const getData = async ( ) =>{
        const response = apiClient.get(GET_ALL_CONTACT);
        setallcontacts((await response).data.contacts);
     }
     getData();
    }, [])
    

 const createNewChannel = async () =>{
    try{

        if(channelname.length >0 && selectedcontacts.length >0){

            const response = await apiClient.post(CREATE_CHANNEL, {
                name: channelname,
                members: selectedcontacts.map((contact)=> contact.value)
            },
        )
        console.log({
            name: channelname,
            members: selectedcontacts.map((contact) => contact.value),
          });
            if( response.status === 200){
                setchannelname("");
                setselectedcontacts([]);
                setnewchannelmodel(false);
                addChannel(response.data.channel)
            }
        }
    }catch(err){
        console.log(err.message)
    }
 }



    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
                            onClick={() => setnewchannelmodel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Create new  Channel 
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newchannelmodel} onOpenChange={setnewchannelmodel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col " >
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={e => setchannelname(e.target.value)}
                            value={channelname}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                        defaultOptions = {allcontacts}
                        placeholder="Seaarch contacts"
                        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white "
                        value={selectedcontacts}
                        onChange={setselectedcontacts}

                        emptyIndicator ={
                            <p className='text-center text-lg leading-10 text-gray-600'> No result found </p>
                        }
                        
                        />
                    </div>
                    <div>
                        <button className='w-full bg-purple-500 hover:bg-purple-300 transition-all duration-300'
                        onClick={createNewChannel}
                        >
                        Create Channel
                        </button>
                    </div>
                 
                </DialogContent>
            </Dialog>


        </>
    )
}

export default CreateChannel
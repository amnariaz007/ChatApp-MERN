import { useAppStore } from '@/store'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils'
import { HOST } from '@/utils/constants'
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip'
import {FiEdit2} from 'react-icons/fi'
import { IoPowerSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {apiClient} from '@/lib/api-client';
import {LOGOUT} from '@/utils/constants'



const ProfileInfo = () => {
    console.clear();
    const navigate = useNavigate();
    const { userInfo, setuserInfo } = useAppStore();
    console.log("User Info:", userInfo);

    const handleLogout = async() =>{
        const response = await apiClient.post(LOGOUT, {}, 
            {withCredentials: true}
        )
        if (response.status === 200 ) {
            navigate('/auth');
            setuserInfo(null)
          }
        console.log({ response });
    }
 

    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2f303b] '>
            <div className='flex gap-3 items-center justify-center'>
                <div className='w-12 h-12 relative'>
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {
                            userInfo.image ? (
                                <AvatarImage
                                    src={`${HOST}${userInfo.image}`}
                                    alt="profile"
                                    className="object-cover w-full h-full bg-black"
                                />
                            ) : (
                                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl broder-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                    {userInfo.firstname
                                        ? userInfo.firstname.split("").shift()
                                        : userInfo.email.split("").shift()
                                    }
                                </div>
                            )

                        }
                    </Avatar>
                </div>
                <div >
                    {userInfo.firstname && userInfo.lastname
                        ? `${userInfo.firstname} ${userInfo.lastname}`
                        : ""
                    }
                </div>
            </div>
            <div className='flex gap-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2
                            onClick={()=> navigate('/profile')}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
               

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            < IoPowerSharp
                            onClick={handleLogout}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                           Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )


}

export default ProfileInfo

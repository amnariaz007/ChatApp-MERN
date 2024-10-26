import { useAppStore } from '@/store'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {getColor} from '@/lib/utils'
import {HOST} from '@/utils/constants'


const ProfileInfo = () => {
    console.clear();


    const { userInfo } = useAppStore();
    console.log("User Info:", userInfo);
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
                                    { firstname
                                   
                                         ? firstname.split("").shift() 
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
        </div>
    )

    
}

export default ProfileInfo

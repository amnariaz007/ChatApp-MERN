import { useAppStore } from "@/store"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import {Input } from "@/components/ui/input"

const Profile = () => {

  const navigate = useNavigate()
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [userinfo, setuseinfor] = useState()
  const [image, setimage] = useState(null);
  const [hovered, sethovered] = useState(false)
  const [selectColor, setselectColor] = useState(0)

  const { userInfo } = useAppStore();
  return (
    <div className=" bg-black h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className=" flex flex-col gap-10 w-[80vw] md:w-max ">
        <div  >
          <IoArrowBack className=" text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-fill w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl broder-[1px] flex items-center justify-center rounded-full ${getColor(selectColor)}`}>
                    {
                      firstname ? firstname.split("").shift() : userInfo.email.split("").shift()
                    }
                  </div>
                )
              }

            </Avatar>
            {
              hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black ring-fuchsia-50">
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                <div className="w-full">
                    <Input className=" rounded-full p-6 bg-[#2c2e3b] border-none"
                    placeholderr="Email"
                    type="email"
                    value={userInfo.email}
                    
                    />
                </div>

              </div>
        </div>


      </div>
    </div>
  )
}

export default Profile
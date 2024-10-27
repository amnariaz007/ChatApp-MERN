import { useAppStore } from "@/store"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPDATE_PROFILE, PROFILE_PICTURE, HOST, DELETE_PROFILE } from '../../utils/constants'

const Profile = () => {

  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [userinfo, setuseinfor] = useState()
  const [image, setimage] = useState(null);
  const [hovered, sethovered] = useState(false)
  const [selectColor, setselectColor] = useState(0)

  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
        setfirstname(userInfo.firstname || "");
        setlastname(userInfo.lastname || "");
        setselectColor(userInfo.color || 0);
    }
    if (userInfo && userInfo.image) {
        const imagePath = `${HOST}${userInfo.image}`;
        setimage(imagePath);
    }
}, [userInfo]);

console.log(image, "image")



  const validateProfile = () => {
    if (!firstname) {
      toast.error("Firstname is required");
      return false;
    }
    if (!lastname) {
      toast.error("Lastname is required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE, { firstname, lastname, color: selectColor })
        console.log({ response });
        if (response.status === 200 && response.data) {
          setuseinfor({ ...response.data });
          navigate("/chat");
        }
      }
      catch (err) {
        console.log(err.message);
      }
    }
  }

  const backnavigate = () => {
    if (userInfo.profilesetup) {
      navigate("/chat")
    } else {
      toast.error("Please setup the profile")
    }
  }

  const hadleFileInputclick = () => {
    fileInputRef.current.click();

  }

  const handleAddImage = async (event) => {
    const file = event.target.files[0]
    console.log({ file });

    if (file) {
      const formData = new FormData();
      console.log(formData, "formdata")
      formData.append('profile-image', file);
      try {
        const response = await apiClient.post(PROFILE_PICTURE, formData)
        console.log({ response });
        if (response.status === 200 && response.data.image) {
          setuseinfor({ ...userinfo, image: response.data.image });
          toast.success("image uploaded successfully")
        }
      }
      catch (err) {
        console.log(err.message);
      }
    }
  }

  const handleDeleteimage = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE)
      console.log({ response });
      if (response.status === 200) {
        setuseinfor({ ...userInfo, image: null });
        toast.success("image remove successfully")
        setimage(null)
      }
    }
    catch (err) {
      console.log(err.message);
    }
  }



  return (
    <div className=" bg-black h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className=" flex flex-col gap-10 w-[80vw] md:w-max ">
        <div  >
          <IoArrowBack onClick={backnavigate} className=" text-4xl lg:text-6xl text-white/90 cursor-pointer" />
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
      <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectColor)}`}>
        {
          // Display the first letter of the firstname if available, otherwise, use the first letter of the email
          firstname ? firstname.charAt(0) : userInfo.email.charAt(0)
        }
      </div>
    )
  }
</Avatar>
            {
              hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black ring-fuchsia-50"
                  onClick={image ? handleDeleteimage : hadleFileInputclick}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
            <input type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAddImage}
              name="profile-image"
              accept=".png, .jpg, .svg, .jpeg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input className=" rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholderr="Email"
                type="email" disabled
                value={userInfo.email}

              />
            </div>

            <div className="w-full">
              <Input className=" rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholderr="First Name"
                type="text"
                value={firstname}
                onChange={(e) => setfirstname(e.target.value)}
              />
            </div>

            <div className="w-full">
              <Input className=" rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholderr="Last Name"
                type="text"
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300  ${selectColor === index ?
                  "outline outline-white/50 outline-1"
                  : ""}}
                       `}
                  key={index}

                  onClick={() => setselectColor(index)}
                >
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full" >
          <Button className="h-16 w-full bg-purple-900 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
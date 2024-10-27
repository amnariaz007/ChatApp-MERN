import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Victory from '@/assets/victory.svg';
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SINGUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


const Auth = () => {
  const navigate = useNavigate();
  const { userInfo ,setuserInfo} = useAppStore();
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [confirm, setconfirm] = useState("")

  const validatesingup = () => {
    if (!email.length) {
      toast.error("email is required");
      return false;
    }
    if (!password.length) {
      toast.error("password is required");
      return false;
    }
    if (password !== confirm) {
      toast.error("password doesn't match");
      return false;
    }
    return true;
  }

  const validatelogin = () => {
    if (!email.length) {
      toast.error("email is required");
      return false;
    }
    if (!password.length) {
      toast.error("password is required");
      return false;
    }
    return true;
  }



  const HandleLogin = async () => {
    if (validatelogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password })
      console.log({ response });
      if (response.data.user.id) {
        setuserInfo(response.data.user)
        if(response.userInfo.profilesetup){
          navigate('/chat')
        } else {
          navigate('/profile')
        }
      }
    }
  }

  const HandleSignup = async () => {
    if (validatesingup()) {
      const response = await apiClient.post(SINGUP_ROUTE, { email, password })
      console.log({ response });
      if (response === 201) {
        setuserInfo(response.data.user)
        navigate('/profile')
      }

    }
  }
  return (
    <div className="h-[100vh] w-[100vw ] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw ] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className=" flex flex-col gap-10 items-center justify-center ">
          <div className=" flex flex-col items-center justify-center ">
            <div className=" flex items-center justify-center ">
              <h1 className="text-5xl font-bold md:text-6xl"> WELCOME </h1>
              {/* <img src={Victory} alt="" /> */}
            </div>
            <p className="font-medium text-center"> Fill the details to get started on the best chat app</p>
          </div>
          <div className="flex items-center justify-center w-full ">
            <Tabs defaultValue="Login" className="w-3/4" >
              <TabsList className="bg-transparent rounded-none w-full" >
                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                  value="Login">Login</TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                  value="Signup">Signup</ TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="Login">
                <Input
                  placeholder="email"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="rounded-full p-6" />

                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="rounded-full p-6" />

                <Button onClick={HandleLogin} className="rounded-full p-6"> Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="Signup">

                <Input
                  placeholder="email"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="rounded-full p-6" />


                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="rounded-full p-6" />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setconfirm(e.target.value)}
                  className="rounded-full p-6" />

                <Button onClick={HandleSignup} className="rounded-full p-6"> Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">

        </div>
      </div>
    </div>
  )
}

export default Auth
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json.json"


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa] ",
  "bg-[#916c4a57] text-[#ff006e] border-[1px] border-[#fa006faa] ",
  "bg-[#719c4a57] text-[#ff006e] border-[1px] border-[#fb006faa] ",
  "bg-[#215c4a57] text-[#ff006e] border-[1px] border-[#fc006faa] ",
]

export const getColor = (color) =>{
  if(color >= 0 && color < colors.length){
    return colors[color]
  }
  return colors[0]
}

export const animationDefaultOptions ={
  loop: true,
  autoplay : true,
  animationData,
}
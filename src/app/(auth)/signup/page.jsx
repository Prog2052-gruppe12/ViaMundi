import { SignUpForm } from "@/components/features/auth/SignUpForm";
import Link from "next/link";
import { Section } from "@/components/common/Section"
import Image from 'next/image'

import loginPicture from "@/assets/beach.jpg";

export default function SignUpPage() {
  return (
      <Section type="transparent">
        <div className="flex flex-row overflow-hidden w-full max-w-[1000px] rounded-2xl">
          <SignUpForm/>
          <div className="relative w-4/5 hidden md:block">
            <Image fill src={loginPicture} quality={75} alt="Sign up image"
                   className="object-cover object-center filter saturate-[65%]"/>
          </div>
        </div>
      </Section>
  )
      ;
}

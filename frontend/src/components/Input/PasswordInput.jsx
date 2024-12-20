import { useState } from "react"

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ value, onChange, placeholder }) {
    const [isShowPassword, setIsShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }
    return (
        <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
            <input type={isShowPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Password'}
                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            />
            {isShowPassword ? <FaEye size={22} className="text-primary cursor-pointer" onClick={() => toggleShowPassword()} /> : <FaEyeSlash size={22} className="text-primary cursor-pointer" onClick={() => toggleShowPassword()} />}

        </div>
    )
}

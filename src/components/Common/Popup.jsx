import { useEffect, useRef } from "react";
import gsap from "gsap";

// ------------------ icons ----------------------------
import {
    BsEmojiSmileUpsideDownFill,
    BsEmojiSmileFill,
    BsFillExclamationTriangleFill
} from "react-icons/bs";

export const Popup = ({
    type = "success",
    tablePopUp = false,
    title,
    unmount = () => { }
}) => {

    const popupRef = useRef(null);

    const colors = {
        success: "#248967",
        alert: "#E4A11B",
        error: "#F66766"
    };

    const icons = {
        success: <BsEmojiSmileFill className="text-green-600 h-6 w-6" />,
        alert: <BsFillExclamationTriangleFill className="text-yellow-500 h-6 w-6" />,
        error: <BsEmojiSmileUpsideDownFill className="text-red-400 h-6 w-6" />
    };

    useEffect(() => {
        // Fade-in animation (always)
        gsap.fromTo(".popup", { opacity: 0 }, { opacity: 1, duration: 0.3 });

        gsap.fromTo(
            popupRef.current,
            { y: -50, opacity: 0 },   // start above the screen
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
            }
        );

        // Auto-close ONLY for success
        if (type === "success") {
            const closeAnim = setTimeout(() => {
                gsap.fromTo(
                    ".popup",
                    { opacity: 1, y: 0 },
                    { opacity: 0, y: 10, duration: 0.5 }
                );
            }, 2000);

            const autoUnmount = setTimeout(() => {
                unmount();     // only success triggers this
            }, 2500);

            return () => {
                clearTimeout(closeAnim);
                clearTimeout(autoUnmount);
            };
        } else if (type === "alert") {
            gsap.fromTo(
                ".popup",
                { opacity: 1, y: 0 },
                { opacity: 1, y: 0, duration: 0 } // No fade-out unless you trigger manually
            );

            // Cleanup returns nothing since no timers
            return () => { };
        }
        else { // Auto-close ONLY for failed
            const closeAnim = setTimeout(() => {
                gsap.fromTo(
                    ".popup",
                    { opacity: 1, y: 0 },
                    { opacity: 0, y: 10, duration: 0.5 }
                );
            }, 3000);

            const autoUnmount = setTimeout(() => {
                unmount();     // only success triggers this
            }, 3500);

            return () => {
                clearTimeout(closeAnim);
                clearTimeout(autoUnmount);
            };
        }

    }, [type]);


    return (
        <div ref={popupRef} className={` opacity-01 popup fixed left-0 right-0 top-0 flex justify-center z-100 ${tablePopUp === true ? "mt-22" : "mt-3"}`}>
            <div className="border border-gray-200 dark:border-gray-500 opacty-0 popup bg-white flex items-center dark:bg-gray-900 dark:text-gray-200 text-sm text-gray-800 shadow-xl p-3 rounded-xl space-x-2">
                <div
                    className={`opacity-01 popup p-2 text-white rounded-full ${document.getElementsByTagName("html")[0].getAttribute("dir") === "ltr" ? "mr-2" : "ml-2"}`}
                >
                    {icons[type]}
                </div>
                <p
                    className="opacity-01 popup"
                    style={{
                        color: colors[type]
                    }}
                >
                    {title}
                </p>
                {type !== "success" && (
                    <button className={`bg-gray-200 text-gray-600 ${type === "alert" ? "hover:text-yellow-700" : "hover:text-red-700"} 
             dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 rounded-lg px-2.5 py-1 
             cursor-pointer`} onClick={unmount}>X</button>
                )}
            </div>
        </div>
    );
};

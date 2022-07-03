import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const SidebarItem = ({ icon, label, hide, item, href, setOpen = () => {} }) => {
  const router = useRouter();
  const active = router.asPath.includes(href);
  if (item && item.length > 0) {
    return (
      <SidebarDropdown
        icon={icon}
        label={label}
        hide={hide}
        item={item}
        setOpen={setOpen}
      />
    );
  }
  const body = (
    <div
      className={`px-6 flex py-4  ${
        hide ? "md:w-[70px]" : "md:w-full"
      } transition-all duration-200 ease-in-out cursor-pointer ${
        active ? "border-l-[5px] border-primary text-primary " : ""
      }`}
    >
      {icon && (
        <Image
          src={`${icon}${active ? "-active" : ""}.svg`}
          alt="icon Image"
          width="20"
          height="20"
        />
      )}
      {!hide && <span className="ml-2 text-sm">{label}</span>}
    </div>
  );
  if (!hide) {
    return <Link href={href}>{body}</Link>;
  }
  return (
    <div className="test" onClick={() => setOpen(true)}>
      {body}
    </div>
  );
};

const SidebarDropdown = ({
  icon,
  label,
  hide,
  item,
  setOpen: setHide,
  main,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const active = item.filter((i) => i.href === router.asPath)[0];

  return (
    <>
      <div
        className={`px-6 flex justify-between py-4  ${
          hide ? "md:w-[70px]" : "md:w-full"
        }  cursor-pointer ${
          active && "border-l-[5px] border-primary text-primary"
        }`}
        onClick={() => {
          if (hide) {
            setHide(true);
          } else {
            setOpen(!open);
          }
        }}
      >
        <div className="flex justify-center">
          {icon && (
            <Image
              src={`${icon}${active ? "-active" : ""}.svg`}
              alt="icon Image"
              width="20"
              height="20"
            />
          )}
          {!hide && <span className="ml-2 text-sm">{label}</span>}
        </div>
        <div
          className={`flex justify-center ${
            hide && "hidden"
          } transition-transform duration-200  ${
            open && "transform -rotate-90"
          }`}
        >
          <Image
            src="/icons/arrow_drop_down.svg"
            alt="arrow dropdown Image"
            width="20"
            height="20"
          />
        </div>
      </div>
      <div
        className={`pl-8 ${
          !open ? "max-h-0" : `max-h-96`
        } h-auto overflow-hidden transition-all duration-200 ease-in-out`}
      >
        {!hide &&
          item.map(({ icon, label, item, href }) => (
            <SidebarItem
              icon={icon}
              label={label}
              key={label}
              hide={hide}
              item={item}
              href={href}
            />
          ))}
      </div>
    </>
  );
};
export default SidebarItem;

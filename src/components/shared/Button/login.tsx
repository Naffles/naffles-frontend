import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ConnectButton,
  DisconnectButton,
  ShowUIButton,
} from "@components/magic/index";
import WalletIcon from "@components/icons/walletIcon";
import DepositButton from "@components/magic/DepositButton";

const Login: React.FC = () => {
  return (
    <div className="p-2 flex flex-col mx-auto">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-nafl-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <WalletIcon size="base" colour="dark" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-nafl-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => <ShowUIButton active={active} />}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <DepositButton active={active} />}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <DisconnectButton active={active} />}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Login;

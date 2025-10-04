"use client";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "../DasboardHeader";
import { getMessages, Message } from "@/services/messageService";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function page() {
  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(),
  });

  console.log(messages, "messages");

  return (
    <div>
      <DashboardHeader pageTitle="Les messages reçus" />
      <div>
        <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
          <table className=" w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envoyé par
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sujet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
              </tr>
            </thead>
            <tbody>
              {messages?.map((message: Message, idx: number) => (
                <tr
                  key={idx}
                  className="hover:bg-white hover:rounded-full transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {message?.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {message?.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {message.phone ? message.phone : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    <Tooltip>
                      <TooltipTrigger>{message?.subject}</TooltipTrigger>
                      <TooltipContent>
                        <p className="bg-primary text-white p-4 rounded-md">
                          {message?.subject}{" "}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    <Tooltip>
                      <TooltipTrigger>
                        {message?.message.slice(0, 12)}...
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="bg-primary text-white p-4 rounded-md">
                          {message?.message}{" "}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

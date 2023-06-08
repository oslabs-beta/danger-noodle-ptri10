"use client";

import { EndpointForm } from "@/app/components/EndpointForm";
import { DisplayData } from "@/app/components/DisplayData";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "inspector";
import QueryGenerator from "./QueryGenerator";
import QueryContainer from "./QueryContainer";

export default function Home({ session }: any) {
  // data fetching: https://youtu.be/gSSsZReIFRk?t=293
  const [data, setData] = useState({});
  const childToParent = (childData: any) => {
    //TODO: type
    setData(childData);
  };
  console.log("data on page.tsx:", data);
  // sessionprovider component allows the wrapped component to use the useSession hook: https://next-auth.js.org/getting-started/client
  return (
    <>
      <SessionProvider session={session}>
        <EndpointForm childToParent={childToParent} />
        <DisplayData data={data} />
      </SessionProvider>
      <QueryContainer endpoint={data.endpoint} />
    </>
  );
}

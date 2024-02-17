import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default async function Home() {
  // const prisma = new PrismaClient();

  // const posts = await prisma.post.findMany();

  return (
    <>
      Magyar Wesnoth
      {/* {posts.map((post) => {
        return (
          <div key={post?.id}>
            <Link href={`/post/${post?.id}/`}>Link</Link>
          </div>
        );
      })} */}
    </>
  );
}

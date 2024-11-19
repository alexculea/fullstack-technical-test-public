"use client";

import { useRouter } from "next/navigation";
import React from 'React';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Skeleton } from "~/components/ui/skeleton"
import { api } from "~/trpc/react";

export function PostsList() {
  const router = useRouter();

  const latestPosts = api.post.getLatestPosts.useQuery({});
  const noPosts = !latestPosts.isLoading && !latestPosts.isError && latestPosts.data?.length === 0;

  const component = latestPosts.isLoading ? (
    <Skeleton />
  ) : noPosts ? (
    <p>You have no posts yet.</p>
  ) :
    (
      <Table>
        <TableCaption>A list of your recent posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestPosts.data?.map((post) => (
            <TableRow key={post.id} onClick={() => router.push(`/posts/${post.id}`)} className="cursor-pointer hover:bg-gray-100">
              <TableCell>{post.name}</TableCell>
              <TableCell className="text-right">{post.createdAt.toDateString()}</TableCell>
              <TableCell className="text-right">{post.updatedAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    return (
      <>
        <h4>Your most 10 recent posts</h4>
        { component }
      </>
    );
}
